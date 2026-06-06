<?php

namespace App\Http\Controllers;

use App\Models\Post;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'categoryId' => 'required',
            'content' => 'required',
            'thumbnail' => 'nullable|image|mimes:png,jpg,jpeg|max:2048'
        ]);
        if ($validator->fails()) {
            return $this->validatorMessage($validator);
        }
        $user = Auth::user();
        $data = [
            'user_id' => $user->id,
            'category_id' => $request->categoryId,
            'title' => $request->title,
            'slug' => $request->slug,
            'body' => $request->content,
            'status' => $request->status
        ];
        if ($request->hasFile('thumbnail')) {
            $path = uniqid() . $request->file('thumbnail')->getClientOriginalName();
            $request->file('thumbnail')->storeAs('post', $path, 'public');
            $data['thumbnail'] = $path;
        }
        $post = Post::create($data);
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
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Admin သာလျှင် ဖျက်ပိုင်ခွင့်ရှိသည်'], 403);
        }
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found'
            ], 404);
        }
        if ($post->thumbnail) {
            Storage::disk('public')->delete('post/' . $post->thumbnail);
        }
        $post->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully'
        ], 201);
    }
    // Post Edit
    public function edit($id)
    {
        $post = Post::find($id);
        $user = Auth::user();
        if ($user->role !== 'admin' && $post->user_id !== $user->id) {
            return response()->json(['message' => 'ဒီ Post ကို ကြည့်ရှုခွင့်မရှိပါ'], 403);
        }
        if (!$post) {
            return response()->json([
                'status' => 'error',
                'message' => 'Post not found'
            ], 404);
        }
        return response()->json($post);
    }
    // Post Update
    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        $user = Auth::user();
        if ($user->role !== 'admin' && $post->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'categoryId' => 'required',
            'content' => 'required',
            'thumbnail' => 'nullable|image|mimes:png,jpg,jpeg|max:2048'
        ]);
        if ($validator->fails()) {
            return $this->validatorMessage($validator);
        }
        $user = Auth::user();
        $data = [
            'user_id' => $user->id,
            'category_id' => $request->categoryId,
            'title' => $request->title,
            'slug' => $request->slug,
            'body' => $request->content,
            'status' => $request->status
        ];
        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail) {
                Storage::disk('public')->delete('post/' . $post->thumbnail);
            }
            $path = uniqid() . $request->file('thumbnail')->getClientOriginalName();
            $request->file('thumbnail')->storeAs('post', $path, 'public');
            $data['thumbnail'] = $path;
        }
        $post->update($data);
        return response()->json([
            'status' => 'success',
            'message' => 'Post updated successfully',
            'post' => $post
        ], 201);
    }
    // Pirvate function for validation
    private function validatorMessage($validator)
    {
        $errors = $validator->errors()->getMessages();
        $errorMessage = [];
        foreach ($errors as $error => $message) {
            $errorMessage[$error] = $message[0];
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Validation fialed',
            'errors' => $errorMessage
        ], 422);
    }
}
