<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        "id_client",
        "id_produit",
        "date_commande",
        "qtt",
        "somme_payer",
        "en_attente",
    ];
}
