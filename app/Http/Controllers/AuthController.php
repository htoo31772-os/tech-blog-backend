<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
            return $this->validationError($validator);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful',
            'user' => $user,
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
            return $this->validationError($validator);
        }
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed. Email or password incorrect.'
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'access_token' => $token,
            'user' => $user
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
        $user->name = $request->name;
        $user->bio  = $request->bio;

        if ($request->hasFile('image')) {
            // ပုံဟောင်း ဖျက်တဲ့ logic
            if ($user->avator) {
                Storage::disk('public')->delete('user/' . $user->avator);
            }

            $fileName = uniqid() . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('user', $fileName, 'public');
            $user->avator = $fileName;
        }
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user
        ]);
    }
    // Update Password
    public function passwordUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return $this->validationError($validator);
        }
        $user = Auth::user();
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
