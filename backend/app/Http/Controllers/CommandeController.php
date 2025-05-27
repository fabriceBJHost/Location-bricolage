<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CommandeController extends Controller
{
    public function index()
    {
        // $commande = Commande::where('statut', 0)
        //     ->orderBy('created_at', 'desc')
        //     ->get();
        $commande = DB::table('commandes')->join('produits', 'commandes.id_produit', '=', 'produits.id')
            ->join('users', 'commandes.id_client', '=', 'users.id')
            ->select('commandes.*', 'produits.id as produit_id', 'produits.nom', 'produits.designation', 'produits.prix', 'produits.image', 'produits.qtt as produit_qtt', 'users.id as id_client', 'users.nom as nom_client')
            ->get();

        return response()->json([
            'commandes' => $commande
        ], Response::HTTP_OK);
    }

    public function validateCommande(int $id)
    {
        $commande = Commande::findOrFail($id);

        if ($commande) {
            $commandeUpdate = Commande::where('id', $commande->id);

            $commandeUpdate->update([
                'statut' => true
            ]);

            return response()->json([
                'message' => "validation"
            ], Response::HTTP_OK);
        }
    }

    public function deleteCommande(Request $request, int $id)
    {
        if (Commande::findOrFail($id)) {

            $commande = Commande::where('id', $id);

            $Product = Produit::where('id', $request->product_id)->first();

            $qtt = $Product->qtt;

            $ProduitUpdated = Produit::where("id", $request->product_id);
            $updatedQtt = ($qtt + $request->qtt);

            // update table product
            $ProduitUpdated->update([
                'qtt' => $updatedQtt
            ]);

            $commande->delete();

            return response()->json([
                'message' => "reservation effacer"
            ], Response::HTTP_OK);
        }
    }

    public function getSingleProduct(int $id)
    {
        $commande = Commande::findOrFail($id);

        return response()->json([
            'commande' => $commande
        ], Response::HTTP_OK);
    }
}
