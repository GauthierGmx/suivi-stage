<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Parcours;

class ParcoursControllerTest extends TestCase
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
    public function test_index_renvoie_une_confirmation_et_la_liste_des_parcours()
    {
        $desParcours = Parcours::all();

        $response = $this->get('/api/parcours');

        $response->assertStatus(200)
                 ->assertJsonCount($desParcours->count());
    }
}
