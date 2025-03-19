<?php

namespace App\Repositories;

use App\Models\User;
use App\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $user)
    {
        parent::__construct($user);
    }
    /**
     * Retrieve a user by their email address.
     *
     * @param string $email The email address to search for
     * @return \App\Models\User|null The user model if found, null otherwise
     */
    public function getByEmail(string $email)
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Verify user credentials against stored data.
     *
     * @param array $credentials An array containing 'email' and 'password' keys
     * @return bool True if credentials are valid, false otherwise
     */
    public function verifyCredentials(array $credentials)
    {
        $user = $this->model->where('email', $credentials['email'])->first();
        if (! $user)
            return false;
        return Hash::check($credentials['password'], $user->password);
    }
    public function add($data)
    {
        $data['id'] = (string) Str::uuid();
        $data['password'] = Hash::make($data['password']);
        return $this->model->create($data);
    }
}