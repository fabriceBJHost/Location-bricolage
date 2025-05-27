<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only("email", "password"))) {

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

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);

        User::create([
            'nom' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Vous etes enregistrer'
        ], Response::HTTP_CREATED);
    }

    /**
    * function to use when user try to logout
    *
    * @return \Illuminate\Http\JsonResponse
    */
    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            'message'=>'you are loged out'
        ], Response::HTTP_OK);
    }

    public function getAuth()
    {
        $user = Auth::user();

        return response()->json([
            'user'=> $user
        ], Response::HTTP_OK);
    }
}
