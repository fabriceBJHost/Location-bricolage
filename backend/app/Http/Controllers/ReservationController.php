<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ReservationController extends Controller
{
    public function index()
    {
        // $reservations = Reservation::Where('id_client', Auth::user()->id)
        //     ->where('en_attente', false)
        //     ->orderBy('id', 'DESC')
        //     ->get();
        $reservations = DB::table('reservations')->join('produits', 'reservations.id_produit', '=', 'produits.id')
            ->where('id_client', Auth::user()->id)
            ->where('en_attente', true)
            ->select('reservations.*', 'produits.id as produit_id', 'produits.nom', 'produits.designation', 'produits.prix', 'produits.image', 'produits.qtt as produit_qtt')
            ->get();

        return response()->json([
            'reservations' => $reservations
        ], Response::HTTP_OK);
    }

    public function getAllReservation()
    {
        $reservations = DB::table('reservations')
            ->join('produits', 'reservations.id_produit', '=', 'produits.id')
            ->join('users', 'reservations.id_client', '=', 'users.id')
            ->where('en_attente', true)
            ->select('reservations.*', 'produits.id as produit_id', 'produits.nom', 'produits.designation', 'produits.prix', 'produits.image', 'produits.qtt as produit_qtt', 'users.id as id_client', 'users.nom as nom_client')
            ->get();

        return response()->json([
            'reservations' => $reservations
        ], Response::HTTP_OK);
    }

    public function validateReservation(int $id)
    {
        $reservationUpdate = Reservation::where('id', $id);
        $reservation = Reservation::findOrFail($id);

        if ($reservation) {
            $reservationUpdate->update([
                'en_attente' => false,
            ]);

            Commande::create([
                'id_client' => $reservation->id_client,
                'id_produit' => $reservation->id_produit,
                'quantiter' => $reservation->qtt,
                'somme_payer' => $reservation->somme_payer,
            ]);

            // create notification
            $Notification = new NotificationController();

            $Notification->createNotification($reservation->id_client, "Votre reservation a été aprouvez par l'admin, veuillez passez prendre votre commande");

            return response()->json([
                'message' => "Reservation Valider"
            ], Response::HTTP_OK);
        }
    }

    public function deleteReservation(Request $request, int $id)
    {
        if (Reservation::findOrFail($id)) {
            $Product = Produit::where('id', $request->product_id)->first();

            print_r($Product);
            $qtt = $Product->qtt;

            $ProduitUpdated = Produit::where("id", $request->product_id);
            $updatedQtt = ($qtt + $request->qtt);

            // update table product
            $ProduitUpdated->update([
                'qtt' => $updatedQtt
            ]);

            $Cart = Cart::where('product_id', $request->product_id)->where('user_id', Auth::user()->id);

            // update table cart to make reservation in true
            $Cart->update([
                'reserved' => false
            ]);

            Reservation::where('id', $id)->delete();

            // create notification
            $Notification = new NotificationController();

            $Notification->createNotification(Auth::user()->id, "Vous avez supprimer un de votre reservation, veuillez consulter votre pannier");

            return response()->json([
                'message' => "reservation effacer"
            ], Response::HTTP_OK);
        }
    }

    public function deleteReservationAdmin(Request $request, int $id)
    {
        if (Reservation::findOrFail($id)) {
            $Product = Produit::where('id', $request->product_id)->first();

            print_r($Product);
            $qtt = $Product->qtt;

            $ProduitUpdated = Produit::where("id", $request->product_id);
            $updatedQtt = ($qtt + $request->qtt);

            // update table product
            $ProduitUpdated->update([
                'qtt' => $updatedQtt
            ]);

            $Cart = Cart::where('product_id', $request->product_id)->where('user_id', $request->user_id);

            // update table cart to make reservation in false
            $Cart->update([
                'reserved' => false
            ]);

            Reservation::where('id', $id)->delete();

            return response()->json([
                'message' => "reservation effacer"
            ], Response::HTTP_OK);
        }
    }

    public function getSIngleReservation(int $id)
    {
        if (Reservation::findOrFail($id)) {
            $Reservation = Reservation::findOrFail($id);

            return response()->json([
                'reservation' => $Reservation
            ], Response::HTTP_OK);
        }
    }
}
