<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    //Category
    public function index()
    {
        $category = Category::latest()->get();
        return response()->json($category);
    }
    // Category ဖန်တီးခြင်း
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name',
            'slug' => 'required|string|unique:categories,slug'
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Created category successfully',
            'category' => $category
        ], 201);
    }
    // Cateory Update လုပ်ခြင်း
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found',
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name',
            'slug' => 'required|string|unique:categories,slug'
        ]);
        if ($validator->fails()) {
            return $this->validationMessage($validator);
        }
        $category->update([
            'name' => $request->name,
            'slug' => $request->slug
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully',
            'category' => $category
        ], 200);
    }
    // Category ဖျက်ခြင်း
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }
        $category->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ], 200);
    }
    // Get Category for User Interface
    public function getCategory()
    {
        $categories = Category::withCount(['post' => function ($query) {
            $query->where('status', 'public');
        }])->get();
        return response()->json($categories);
    }
    // Get Post By Category
    public function getPostByCategory($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $posts = Post::with(['category', 'user'])->where('category_id', $category->id)->where('status', 'public')->latest()->get();
        return response()->json([
            'category_name' => $category->name,
            'posts' => $posts
        ]);
    }
    // Private function for validation
    private function validationMessage($validator)
    {
        $errors = $validator->errors()->getMessages();
        $errorMessage = [];
        foreach ($errors as $error => $message) {
            $errorMessage[$error] = $message[0];
        }
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errorMessage
        ], 422);
    }
}
