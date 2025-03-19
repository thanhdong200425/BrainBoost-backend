<?php

namespace App\Contracts;
use App\Contracts\BaseRepositoryInterface;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function getByEmail(string $email);
    public function verifyCredentials(array $credentials);
}