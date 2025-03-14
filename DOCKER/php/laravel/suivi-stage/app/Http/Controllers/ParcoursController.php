<?php

namespace App\Http\Controllers;

use App\Models\Parcours;
use Illuminate\Http\Request;

class ParcoursController extends Controller
{
    /**
     * Retourne tous les parcours
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $fields = explode(',', $request->query('fields', '*'));

        $allowedFields = ['codeParcours','idDepartement','libelle'];
        $fields = array_intersect($fields, $allowedFields);

        $parcours = Parcours::select(empty($fields) ? '*' : $fields)->get();

        return response()->json($parcours, 200);
    }

}
