<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }
        $validated = $validator->validated();
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'access_token' => $token
        ], 200);
    }
    // Login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }
        $validated = $validator->validated();
        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email or password incorrect.'
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'access_token' => $token,
            'user' =>  [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }
    // Update Profile
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|min:3|max:50',
            'bio'   => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);
        if ($validator->fails()) {
            return $this->validationError($validator);
        }
        $oldImage = $user->avator;
        $newImageFile = null;
        try {
            $user->name = $request->name;
            $user->bio  = $request->bio;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = $file->hashName();
                $newImageFile = $file->storeAs('user', $fileName, 'public');
                if (!$newImageFile) {
                    return response()->json([
                        'message' => 'Image upload failed'
                    ], 500);
                }
                $user->avator = $fileName;
            }

            $user->save();
        } catch (\Throwable $e) {
            if ($newImageFile) {
                Storage::disk('public')->delete($newImageFile);
            }
            report($e);

            return response()->json([
                'message' => 'Profile update failed'
            ], 500);
        }

        if ($newImageFile && $oldImage) {
            try {
                Storage::disk('public')->delete('user/' . $oldImage);
            } catch (\Throwable $e) {
                report($e);
            }
        }
        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user
        ]);
    }
    // Update Password
    public function passwordUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed|different:current_password',
        ]);
        if ($validator->fails()) {
            return $this->validationError($validator);
        }
        $user = Auth::user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => [
                    'current_password' => 'Current password is incorrect',
                ],
            ], 422);
        }
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json(['message' => 'Password changed successfully']);
    }
    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ], 200);
    }
    // Validation Error
    public function validationError($validator)
    {
        $errors = $validator->errors()->getMessages();
        $errorMessage = [];

        foreach ($errors as $field => $messages) {
            $errorMessage[$field] = $messages[0];
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errorMessage,
        ], 422);
    }
}
