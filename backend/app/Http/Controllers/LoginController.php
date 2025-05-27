<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    /**
    * function to use when user login
    * return json to frontend
    *
    * @param LoginRequest $request
    * @return JsonResponse
    */
    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'email or password incorect'
            ], Response::HTTP_UNAUTHORIZED);
        } else {
            $user = Auth::user();

            $token = $user->createToken('ACCESS_TOKEN')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token
            ], Response::HTTP_OK);
        }
    }

    /**
    * function to use when user try to register
    *
    * @param RegisterRequest $request
    * @return JsonResponse
    */
    public function register(RegisterRequest $request)
    {
        $requestValue = $request->validated();

        User::create([
            'nom' => $requestValue['nom'],
            'prenom' => $requestValue['prenom'],
            'is_mentor' => $requestValue['is_mentor'],
            'email' => $requestValue['email'],
            'password' => Hash::make($requestValue['password'])
        ]);

        return response()->json([
            'message' => 'You are registered'
        ], Response::HTTP_CREATED);
    }

    /**
    * function to use when user try to logout
    *
    * @return JsonResponse
    */
    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            'message'=>'you are loged out'
        ], Response::HTTP_OK);
    }
}
