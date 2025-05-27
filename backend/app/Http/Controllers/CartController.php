<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Produit;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CartController extends Controller
{
    public function index()
    {
        $CartUser = DB::table('carts')
            ->join('produits', 'carts.product_id', '=', 'produits.id')
            ->select('carts.*', 'produits.*')
            ->where('carts.user_id', Auth::user()->id)
            ->where('carts.reserved', false)
            ->orderBy('carts.id','DESC')
            ->get();


        return response()->json([
            'carts' => $CartUser
        ], Response::HTTP_OK);
    }

    public function addToCart(Request $request)
    {
        Cart::create([
            'user_id'=> Auth::user()->id,
            'product_id'=> $request->product_id,
        ]);

        return response()->json([
            'mesage' => 'Produit ajouter a la carte'
        ], Response::HTTP_CREATED);
    }

    public function reserved(Request $request)
    {
        $Product = Produit::where('id', $request->product_id)->first();

        $qtt = $Product->qtt;

        if ($qtt < $request->qtt ) {

            return response()->json([
                'message' => 'veuillez remplire la bonne quantiter'
            ], Response::HTTP_BAD_REQUEST);
        } else {
            // get the produit
            $ProduitUpdated = Produit::where("id", $request->product_id);
            $updatedQtt = ($qtt - $request->qtt);
            $sommePayer =  ($Product->prix * $request->qtt);

            $Cart = Cart::where('product_id', $request->product_id)->where('user_id', Auth::user()->id);

            // update table cart to make reservation in true
            $Cart->update([
                'reserved' => true
            ]);

            // create the reservation
            Reservation::create([
                "id_client" => Auth::user()->id,
                "id_produit"=> $request->product_id,
                "date_commande"=> date('Y-m-d'),
                'qtt'=> $request->qtt,
                'somme_payer'=> $sommePayer,
            ]);

            // update table product
            $ProduitUpdated->update([
                'qtt' => $updatedQtt
            ]);

            // create notification
            $Notification = new NotificationController();

            $Notification->createNotification(Auth::user()->id, "Votre Reservation sera en attente d'aprobation dans votre page reservation");

            return response()->json([
                'message' => 'updated'
            ], Response::HTTP_OK);
        }


    }

    public function deleteFromCart(int $id)
    {
        Cart::where('user_id', Auth::user()->id)->Where('product_id', $id)
        ->where('reserved', false)->delete();

        return response()->json([
            'message' => 'deleted'
        ], Response::HTTP_OK);
    }

    public function countCart()
    {
        $CartUser = Cart::where('user_id', Auth::user()->id)->where('reserved', false)->count();

        return response()->json([
            'count' => $CartUser
        ], Response::HTTP_OK);
    }

    public function isInCart(int $id)
    {
        $CartUser = Cart::Where('user_id', Auth::user()->id)->Where("reserved", false)->firstWhere('product_id', $id);

        if (!empty($CartUser)) {
            return response()->json([
                'is_in'=> true
            ]);
        } else {
            return response()->json([
                'is_in'=> false
            ]);
        }
    }
}
