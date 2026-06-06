<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Newletter;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //Dashboard-stats
    public function index()
    {
        return response()->json([
            'stats' => [
                'totalPosts' => Post::count(),
                'totalUsers' => User::count(),
                'totalSubscribers' => Newletter::count(),
                'newComments' => Comment::count(),
            ],
            'recentPosts' => Post::latest()->take(5)->get()
        ]);
    }
    // User List
    public function userList()
    {
        $users = User::latest()->paginate(10);
        return response()->json($users);
    }
    // Change User role
    public function role(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();
        return response()->json(['message' => 'Role updated successfully']);
    }
    // Destory User
    public function destory($id)
    {
        $currentUserId = Auth::user()->id;

        if ($id == $currentUserId) {
            return response()->json(['message' => 'You cannot delete yourself!'], 403);
        }
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
    // NewLetter
    public function newLetter()
    {
        $subscribers = Newletter::latest()->paginate(10);
        return response()->json($subscribers);
    }
    // Delete Email
    public function delete($id)
    {
        newLetter::findOrFail($id)->delete();
        return response()->json(['message' => 'Subscriber removed']);
    }
}
