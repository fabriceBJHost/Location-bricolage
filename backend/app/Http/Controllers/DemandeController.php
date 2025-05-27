<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\demande;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\SendDemandeRequest;
use App\Http\Requests\UnsendDemandeRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class DemandeController extends Controller
{
    //

    /**
     * Send demande in formateur
     *
     * @param SendDemandeRequest $request
     * @param int $id id du formateur 
     * @return JsonResponse
     **/
    public function sendDemande(SendDemandeRequest $request, int $id)
    {
        /**
         * seule les etudiant peuvent envoyer une demande
         */
        if (!Gate::allows('allow_etudiant')) {
            
            return response()->json([
                'message' => 'Action Non autoriser'
            ], Response::HTTP_FORBIDDEN);
        } else {
            
            $requestValue = $request->validated();
            $formateurId = User::findOrFail($id)->id;
            $demandeIfExist = demande::where('formateur_id', $formateurId)->where('aprenti_id', Auth::user()->id)->first();

            if ($demandeIfExist !== null AND $demandeIfExist->demande === 0) {

                $demandeToUpdate = demande::where('formateur_id', $formateurId)->where('aprenti_id', Auth::user()->id);

                $demandeToUpdate->update([
                    'demande' => $requestValue['demande'],
                ]);
        
                return response()->json([
                    'demande' => $demandeToUpdate->get()
                ], Response::HTTP_OK);
            } else {
        
                $demande = demande::create([
                    'formateur_id' => $formateurId,
                    'demande' => $requestValue['demande'],
                    'aprenti_id' => Auth::user()->id,
                ]);
        
                return response()->json([
                    'demande' => $demande
                ], Response::HTTP_OK);
            }
        }
    }

    /**
     * Unsend demande
     *
     * @param UnsendDemandeRequest $request 
     * @param int $id id du formateur
     * @return JsonResponse
     **/
    public function unsendDemande(UnsendDemandeRequest $request, int $id)
    {
        if (!Gate::allows('allow_etudiant')) {
            
            return response()->json([
                'message' => 'Action Non autoriser'
            ], Response::HTTP_FORBIDDEN); 
        } else {

            $requestValue = $request->validated();
            $formateurId = User::findOrFail($id)->id;
            $demandeToUpdate = demande::where('formateur_id', $formateurId)->where('aprenti_id', Auth::user()->id);

            $demandeToUpdate->update([
                'demande' => $requestValue['demande']
            ]);

            return response()->json([
                'demande' => $demandeToUpdate->get()
            ], Response::HTTP_OK); 
        }
                
    }

    /**
     * get demande
     * 
     * @return JsonResponse
     **/
    public function getDemande()
    {
        $demande = User::where('is_mentor', 1)->where('id', );
    }
}
