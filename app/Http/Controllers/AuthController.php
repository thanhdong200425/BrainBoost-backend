<?php

namespace App\Http\Controllers;

use App\Contracts\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    public function signIn(Request $request)
    {
        // Request validation
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Get credentials
        $credentials = $request->only('email', 'password');

        // Attempt to verify user, if this failure, return an error response
        if (! $this->userRepository->verifyCredentials($credentials))
            return response()->json(['message' => 'Invalid credentials'], 401);

        // Get the email 
        $user = $this->userRepository->getByEmail($credentials['email']);
        $accessToken = $user->createToken('access-token')->plainTextToken;
        return response()->json([
            "user" => $user,
            "token" => $accessToken
        ], 200);
    }
    public function signUp(Request $request)
    {
        // Validate request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'confirmPassword' => 'required|same:password'
        ]);

        // Get credentials
        $credentials = $request->only('email', 'password');

        // Check whether current credentials are existing in the database or not
        $isExist = $this->userRepository->getByEmail($credentials['email']);
        if ($isExist)
            return response()->json([
                "message" => "Email already was used"
            ], 400);

        $newUser = $this->userRepository->add($credentials);
        $accessToken = $newUser->createToken('access-token')->plainTextToken;
        return response()->json([
            "user" => $newUser,
            "token" => $accessToken
        ], 200);
    }
}
