<?php
    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    
    class AuthController extends Controller
    {
        public function checkAuth()
        {
            return response()->json(['authenticated' => Auth::check()]);
        }
    }
?>