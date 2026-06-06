<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TechBlogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register'])->name('home.register');
Route::post('/login', [AuthController::class, 'login'])->name('home.login');
Route::post('/newLetter', [TechBlogController::class, 'newLetter'])->name('home.newLetter');
Route::get('/techBlog/post', [TechBlogController::class, 'index'])->name('home.post.index');
Route::get('/techBlog/post/postDetail/{id}', [TechBlogController::class, 'postDetail'])->name('home.post.postDetail');
Route::get('/techBlog/post/{postId}/reviews', [TechBlogController::class, 'reviews'])->name('home.post.reviews');
Route::get('/techBlog/category/getCategory', [CategoryController::class, 'getCategory'])->name('home.category.getCategory');
Route::get('/techBlog/category/{slug}', [CategoryController::class, 'getPostByCategory'])->name('home,category.getPostByCategory');

// User Middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/profile-update', [AuthController::class, 'updateProfile'])->name('home.user.updateProfile');
    Route::post('/user/password-update', [AuthController::class, 'passwordUpdate'])->name('home.user.passwordUpdate');
    Route::post('/logout', [AuthController::class, 'logout'])->name('home.logout');
    // Comment
    Route::post('/techBlog/post/{postId}/newReviews', [CommentController::class, 'newReview'])->name('home.post.newReview');
});
Route::middleware('auth:sanctum', 'role:admin,author')->prefix('admin')->group(function () {
    // dashboard
    Route::get('/dashboard-stats', [AdminController::class, 'index'])->name('admin.dashboard.index');
    Route::get('/users', [AdminController::class, 'userList'])->name('admin.user.userList');
    Route::post('/users/{id}/role', [AdminController::class, 'role'])->name('admin.user.role');
    Route::delete('/users/{id}', [AdminController::class, 'destory'])->name('admin.user.destory');
    // NewLetter
    Route::get('/subscribers', [AdminController::class, 'newLetter'])->name('admin.newLetter');
    Route::delete('/subscribers/{id}', [AdminController::class, 'delete'])->name('admin.newLetter.delete');
    // Category
    Route::get('/category', [CategoryController::class, 'index'])->name('admin.category.index');
    Route::post('/category/store', [CategoryController::class, 'store'])->name('admin.category.store');
    Route::post('/category/delete/{id}', [CategoryController::class, 'destroy'])->name('admin.category.delete');
    Route::post('/category/update/{id}', [CategoryController::class, 'update'])->name('admin.category.update');
    // Post
    Route::get('/post', [PostController::class, 'index'])->name('admin.post.index');
    Route::post('/post/store', [PostController::class, 'store'])->name('admin.post.store');
    Route::post('/post/delete/{id}', [PostController::class, 'destroy'])->name('admin.post.delete');
    Route::get('/post/edit/{id}', [PostController::class, 'edit'])->name('admin.post.edit');
    Route::post('/post/update/{id}', [PostController::class, 'update'])->name('admin.post.update');
});
