<?php

namespace App\Contracts;

interface BaseRepositoryInterface
{
    public function add($data);
    public function delete($id);
    public function update($id, $newData);
    public function get($id);

}