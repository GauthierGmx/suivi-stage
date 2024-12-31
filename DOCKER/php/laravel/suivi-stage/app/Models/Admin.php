<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idAdmin',
        'motDePasse',
        'sel'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idAdmin';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Droit
    public function droit()
    {
        return $this->belongsTo(Droit::class);
    }

    // Relation 1-N avec Personnel
    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }
}
