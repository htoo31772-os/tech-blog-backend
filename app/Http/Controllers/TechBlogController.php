<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Newletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TechBlogController extends Controller
{
    //Get Post Data
    public function index(Request $request)
    {
        $query = Post::with(['category', 'user:id,name'])->where('status', 'public');
        if ($request->has('search')) {
            $key = $request->search;
            $query->where('title', 'like', "%{$key}%");
        }
        $posts = $query->latest()->paginate(6);
        return response()->json($posts);
    }
    // Post Detail
    public function postDetail($id)
    {
        $postDetail = Post::with(['category', 'user'])->where('id', $id)->firstOrFail();
        return response()->json($postDetail);
    }
    // Get review on his post
    public function reviews($postId)
    {
        $reviews = Comment::with('user')->where('post_id', $postId)->latest()->get();
        $reviews->each(function ($review) {
            $review->time_ago = $review->created_at->diffForHumans();
        });
        return response()->json($reviews);
    }
    // New Letter
    public function newLetter(Request $request)
    {
        $email = auth('sanctum')->check() ? auth('sanctum')->user()->email : $request->email;
        if (!$email) {
            return response()->json(['message' => 'Email is required'], 422);
        }
        $exists = Newletter::where('email', $email)->exists();
        if ($exists) {
            return response()->json(['message' => 'ဒီ Email က စာရင်းသွင်းပြီးသား ဖြစ်နေပါတယ်'], 400);
        }
        NewLetter::create(['email' => $email]);
        return response()->json(['message' => 'Newsletter subscribed successfully!']);
    }
}
