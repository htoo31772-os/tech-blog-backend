<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\PostRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // Data ရယူခြင်း
    public function index()
    {
        $user = Auth::user();
        $post = Post::with('category');
        if ($user->role !== 'admin') {
            $post->where('user_id', $user->id);
        }
        return response()->json($post->latest()->get());
    }
    // ဖန်တီးခြင်း
    public function store(PostRequest $request)
    {
        $user = Auth::user();
        $data = [
            'user_id' => $user->id,
            'category_id' => $request->categoryId,
            'title' => $request->title,
            'body' => $request->content,
            'status' => $request->status
        ];
        $file = $request->file('thumbnail');
        $path = null;
        try {
            if ($file) {
                $path = $file->store('post', 'public');
                $data['thumbnail'] = basename($path);
            }
            $post = DB::transaction(function () use ($data) {
                return Post::create($data);
            });
        } catch (\Throwable $e) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
            throw $e;
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Post created successfully',
            'post' => $post
        ], 201);
    }
    // ဖျက်သိမ်းခြင်း
    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found'
            ], 404);
        }
        $user = Auth::user();
        if ($user->role !== 'admin' && $user->role !== 'author' || $post->user_id !== $user->id) {
            return response()->json(['message' => 'Admin နှင့် Author သာလျှင် ဖျက်ပိုင်ခွင့်ရှိသည်'], 403);
        }
        $thumbnail = $post->thumbnail;
        DB::transaction(function () use ($post) {
            $post->delete();
        });
        if ($thumbnail) {
            Storage::disk('public')->delete('post/' . $post->thumbnail);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully'
        ], 200);
    }
    // Post Edit
    public function edit($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found'
            ], 404);
        }

        $user = Auth::user();

        if ($user->role !== 'admin' && $post->user_id !== $user->id) {
            return response()->json(['message' => 'ဒီ Post ကို ကြည့်ရှုခွင့်မရှိပါ'], 403);
        }
        return response()->json($post);
    }
    // Post Update
    public function update(PostRequest $request, $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found'
            ], 404);
        }
        $user = Auth::user();
        if ($user->role !== 'admin' && $post->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = [
            'category_id' => $request->categoryId,
            'title' => $request->title,
            'body' => $request->content,
            'status' => $request->status
        ];
        $file = $request->file('thumbnail');
        $oldThumbnail = $post->thumbnail;
        $newPath = null;
        try {
            if ($file) {
                $newPath = $file->store('post', 'public');
                $data['thumbnail'] = basename($newPath);
            }
            DB::transaction(function () use ($post, $data) {
                $post->update($data);
            });
            if ($newPath && $oldThumbnail) {
                Storage::disk('public')->delete('post/' . $oldThumbnail);
            }
        } catch (\Throwable $e) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }
            throw $e;
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Post updated successfully',
            'post' => $post
        ], 200);
    }
}
