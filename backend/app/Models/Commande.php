<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        "id_client",
        "id_produit",
        "quantiter",
        "somme_payer",
        "statut",
    ];
}
