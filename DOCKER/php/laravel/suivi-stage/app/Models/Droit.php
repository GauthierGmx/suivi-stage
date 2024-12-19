<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Droit extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idDroit',
        'libelle'
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idDroit';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Admin
    public function admins()
    {
        return $this->hasMany(Admin::class);
    }

    // Relation N-N avec Personnel
    public function personnels()
    {
        return $this->hasMany(Personnel::class);
    }
}
