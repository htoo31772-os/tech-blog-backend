<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function newReview(Request $request, $postId)
    {
        Validator::make($request->all(), [
            'content' => 'required|string'
        ])->validate();
        $post = Post::where('id', $postId)->where('status', 'public')->firstOrFail();
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => "Unauthorized: User not found from token",
            ], 401);
        }
        $reviews = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'content' => $request->content
        ]);
        return response()->json($reviews->load('user'), 201);
    }
}
