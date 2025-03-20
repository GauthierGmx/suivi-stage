<?php

namespace App\Exports;

class AffectationsExport extends BaseExport
{
    public function headings(): array
    {
        return [
            'Année Universitaire',
            'Nom Prénom Enseignant',
            'Nom Prénom Étudiant'
        ];
    }
}
