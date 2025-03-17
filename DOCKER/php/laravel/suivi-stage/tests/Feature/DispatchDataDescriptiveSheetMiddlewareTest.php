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
    =============================================
        TEST DE LA METHODE handleSheetGet
    =============================================
    */

    /**
     * La méthode handleSheetGet va retourner une confirmation 200 et l'ensemble des infos liés à la fiche descriptive
     * 
     * @return void
     */

    public function test_handleSheetGet_renvoie_une_confirmation_et_les_infos_de_la_fiche_descriptive(){

        $response = $this->get('/api/fiche-descriptive/1');
        $response->assertStatus(200);
                
    }
}
