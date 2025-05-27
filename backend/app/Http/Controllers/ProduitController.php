<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class ProduitController extends Controller
{
    /**
     * fetch all product
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function fetchProduct()
    {
        $id = Cart::Where('reserved', false)
        // ->where('user_id', Auth::user()->id)
        ->pluck("product_id")->toArray();
// [2, 4]
        // dd($arrayId);

        $produits = Produit::whereNotIn('id', $id)->Where("qtt", "!=", 0)->get();
        // $produits = Produit::Where("qtt", "!=", 0)->get();


        // dd($produits);
        return response()->json([
            'produits' => $produits
        ], Response::HTTP_OK);
    }

    public function getAllProduct()
    {
        $product = Produit::all();

        return response()->json([
            'produits' => $product
        ], Response::HTTP_OK);
    }

    public function getStat()
    {
        $allProduct = Produit::count();

        $productStock = Produit::where('qtt', '!=', 0)->count();

        $productRuptureStock = Produit::where('qtt', 0)->count();

        return response()->json([
            'allProduct' => $allProduct,
            'productStock' => $productStock,
            'productRuptureStock' => $productRuptureStock,
        ], Response::HTTP_OK);
    }

    public function addProduct(Request $request)
    {
        // echo ($request->all());
        $request->validate([
            'nom' => 'required',
            'designation' => 'required',
            'prix' => 'required',
            'qtt' => 'required',
        ]);

        $extention = $request->file('images')->getClientOriginalName();
        $files = $request->file('images')->storeAs('public/images' . time() . $extention);

        $url = Storage::url($files);

        Produit::create([
            'nom' => $request->nom,
            'designation' => $request->designation,
            'prix' => $request->prix,
            'qtt' => $request->qtt,
            'image' => $url,
        ]);

        return response()->json([
            'message' => 'Crée avec success'
        ], Response::HTTP_CREATED);
    }

    public function updateProduct(Request $request, int $id)
    {
        $request->validate([
            'nom' => 'required',
            'designation' => 'required',
            'prix' => 'required',
            'qtt' => 'required',
        ]);

        $product = Produit::where('id', $id);

        $url = "";
        if ($request->file('images')) {
            $extention = $request->file('images')->getClientOriginalName();
            $files = $request->file('images')->storeAs('public/images' . time() . $extention);

            $url = Storage::url($files);
        } else {
            $url = $request->images;
        }


        $product->update([
            'nom' => $request->nom,
            'designation' => $request->designation,
            'prix' => $request->prix,
            'qtt' => $request->qtt,
            'image' => $url,
        ]);

        return response()->json([
            "message" => "Mise a jour terminer avec success",
            "produits" => $product->get()
        ], Response::HTTP_OK);
    }

    public function getSingleProduct(int $id)
    {
        $product = Produit::findOrFail($id);

        return response()->json([
            'product' => $product
        ], Response::HTTP_OK);
    }

    public function deleteProduct(int $id)
    {
        if (Produit::findOrFail($id)) {

            Produit::where('id', $id)->delete();

            return response()->json([
                "message" => "Suppression terminer avec success"
            ], Response::HTTP_OK);
        }
    }

    public function serchProduct(Request $request)
    {
        $request->validate([
            'search' => 'required',
        ]);

        $search = Produit::where('nom', "LIKE", '%' . $request->search . '%')->orWhere("designation", "LIKE", '%' . $request->search . '%')
            ->orWhere("prix", "LIKE", '%' . $request->search . '%')
            ->get();

        return response()->json([
            'search' => $search
        ], Response::HTTP_OK);
    }
}
