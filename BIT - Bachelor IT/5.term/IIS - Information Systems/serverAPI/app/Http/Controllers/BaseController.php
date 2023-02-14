<?php

/**
* Author: Pavel Šesták
*/

namespace App\Http\Controllers;

use App\Models\Conference;
use Illuminate\Http\Request;

/**
 * @OA\Info(title="eConference API", version="1.0")
 */
class BaseController extends Controller
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }

    public function getAll()
    {
        return $this->model::all();
    }

    public function getById(Request $request)
    {
        $id = $request->id;
        $model = $this->model::findOrFail($id);
        return $model;
    }

    public function create(Request $request)
    {
        $this->model::create($request->all());
        return $this->model;
    }

    public function update(Request $request)
    {
        $id = $request->id;
        $model = $this->model::findOrFail($id);
        $model->update($request->all());
        return $model;
    }

    public function delete(Request $request)
    {
        $id = $request->id;
        $model = $this->model::findOrFail($id);
        return $model->delete();
    }
}
