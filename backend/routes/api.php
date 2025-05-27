<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// route for everyone
Route::get('/', function () {
    return response()->json(['name' => "test", "id" => 12]);
})->name('accueil');


// {"name" => "test"}

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::get('product', [ProduitController::class, 'fetchProduct']);

// protected route, only for user authenticated
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'getAuth']);

    // user route
    // Route::get('user/auth', [UserController::class, 'getAuthenticatedUser']);
    //     // asina parametre id ana user ande tadiavina ny URL am farany exemple user/other/3
    // Route::get('user/other/{id}', [UserController::class, 'getOtherUser']);
    // Route::get('user/allmentor', [UserController::class, 'getAllMentor']);
    // Route::get('user/alletudiant', [UserController::class, 'getAllEtudiant']);
    // // asina parametre ana id an ilay user authentifier iany ny URL am farany
    // Route::post('user/update/mentor/{id}', [UserController::class, 'updateUser']);
    // Route::post('user/update/etudiant/{id}', [UserController::class, 'updateUserEtudiant']);
    // Route::post('user/search', [UserController::class, 'searchUser']);

    // // formation route
    // Route::get('formation/getall', [FormationController::class, 'getAllFormation']);
    // Route::get('formation/getone/{id}', [FormationController::class, 'getOneFormation']);
    // Route::get('formation/getauth', [FormationController::class, 'getAuthFormation']);
    // Route::post('formation/create', [FormationController::class, 'createFormation']);
    // Route::post('formation/update/{id}', [FormationController::class, 'updateFormation']);
    // Route::post('formation/addLike/{id}', [FormationController::class, 'addLike']);
    // Route::post('formation/search', [FormationController::class, 'searchFormation']);

    Route::prefix('product')->group(function () {
        Route::post('store', [ProduitController::class, 'addProduct']);
        Route::get('all', [ProduitController::class, 'getAllProduct']);
        Route::get('stat', [ProduitController::class, 'getStat']);
        Route::get('{id}', [ProduitController::class, 'getSingleProduct']);
        Route::post('update/{id}', [ProduitController::class, 'updateProduct']);
        Route::post('delete/{id}', [ProduitController::class, 'deleteProduct']);

        Route::post('search', [ProduitController::class, 'serchProduct']);
    });

    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);

        Route::get('count', [CartController::class, 'countCart']);

        Route::get('isin/{id}', [CartController::class, 'isInCart'])
        ;
        Route::post('store', [CartController::class, 'addToCart']);

        Route::post('reserve', [CartController::class, 'reserved']);

        Route::post('delete/{id}', [CartController::class, 'deleteFromCart']);
    });

    Route::prefix('reservation')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::get('all', [ReservationController::class, 'getAllReservation']);
        Route::get('{id}', [ReservationController::class, 'getSIngleReservation']);
        Route::post('delete/{id}', [ReservationController::class, 'deleteReservation']);
        Route::post('validate/{id}', [ReservationController::class, 'validateReservation']);
        Route::post('deleteadmin/{id}', [ReservationController::class, 'deleteReservationAdmin']);
    });

    Route::prefix('commande')->group(function () {
        Route::get('all', [CommandeController::class, 'index']);
        Route::get('{id}', [CommandeController::class, 'getSingleProduct']);
        Route::post('validate/{id}', [CommandeController::class, 'validateCommande']);
        Route::post('delete/{id}', [CommandeController::class, 'deleteCommande']);
    });

    Route::prefix('notification')->group(function () {
        Route::get('all', [NotificationController::class, 'getNotification']);
        Route::get('count', [NotificationController::class, 'countNotification']);
        Route::post('{id}', [NotificationController::class, 'makeSeen']);
        Route::post('all/seen', [NotificationController::class, 'seenAll']);
    });
});
