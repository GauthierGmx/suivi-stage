<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FicheDescriptiveController extends Controller
{
    public function index()
    {
        return json_encode([
            'id' => 1,
            'title' => 'Fiche descriptive',
            'description' => 'Fiche descriptive de stage',
            'created_at' => '2021-06-01 00:00:00',
            'updated_at' => '2021-06-01 00:00:00',
        ]);
    }
}
