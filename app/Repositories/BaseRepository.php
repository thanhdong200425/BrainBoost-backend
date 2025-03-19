<?php

namespace App\Repositories;

use App\Contracts\BaseRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\Model;

class BaseRepository implements BaseRepositoryInterface
{
    protected $model;
    public function __construct(Model $model)
    {
        $this->model = $model;
    }
    public function add($data)
    {
        return $this->model->create($data);
    }
    public function delete($id)
    {
        try {
            return $this->model->findOrFail($id)->delete();
        } catch (Exception $e) {
            echo "Error in delete()" + $e->getMessage();
            return false;
        }
    }
    public function update($id, $newData)
    {
        try {
            $instance = $this->model->findOrFail($id);
            $instance->update($newData);
            return $instance;
        } catch (Exception $e) {
            echo "Error in update(): " + $e->getMessage();
            return false;
        }
    }
    public function get($id)
    {
        try {
            return $this->model->findOrFail($id);
        } catch (Exception $th) {
            echo "Error in get(): " + $th->getMessage();
            return false;
        }
    }
}