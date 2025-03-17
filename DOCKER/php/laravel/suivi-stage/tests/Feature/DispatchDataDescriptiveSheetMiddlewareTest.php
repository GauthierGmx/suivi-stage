<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DispatchDataDescriptiveSheetMiddlewareTest extends TestCase
{
    /**
     * Recréer les tables avec les seeders
     * 
     * @return void
     */
    
    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
        $this->artisan('db:seed');
    }

    /*
    ================================
        TEST DE LA METHODE INDEX
    ================================
    */

    /**
     * La méthode index va retourner une confirmation 200 et la liste de toutes les entreprises
     * 
     * @return void
     */
}
