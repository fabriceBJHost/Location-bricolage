<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\userFormation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\CreateFormationRequest;
use App\Http\Requests\UpadteFormationRequest;
use App\Http\Requests\AddLikeFormationRequest;
use App\Http\Requests\SearchFormationRequest;
use Symfony\Component\HttpFoundation\Response;

class FormationController extends Controller
{
    /**
     * get all formation
     *
     * @return JsonResponse
     **/
    public function getAllFormation()
    {
        $formation = Formation::all();

        return response()->json([
            'formations' => $formation
        ], Response::HTTP_OK);
    }

    /**
     * get one Formation
     *
     * @param int $id
     * @return JsonResponse
     **/
    public function getOneFormation(int $id)
    {
        $formation = Formation::findOrFail($id);

        return response()->json([
            'formation' => $formation
        ], Response::HTTP_OK);
    }

    /**
     * get the formation of authenticated mentor
     *
     * @return JsonResponse
     **/
    public function getAuthFormation()
    {
        /**
         * teste si l'user est un mentor ou pas
         */
        if (!Gate::allows('allow_mentor')) {

            return response()->json([
                'message' => 'Action réfuser'
            ], Response::HTTP_FORBIDDEN);
        } else {
            
            $formation = Formation::where('id', "=", Auth::user()->id)->where('is_mentor', true)->get();
    
            return response()->json([
                'formations' => $formation
            ], Response::HTTP_OK);
        }
    }

    /**
     * create Formation
     *
     * @param CreateFormationRequest $request
     * @return JsonResponse
     **/
    public function createFormation(CreateFormationRequest $request)
    {
        /**
         * teste si l'user est un mentor ou pas
         */
        if (!Gate::allows('allow_mentor')) {

            return response()->json([
                'message' => 'Action réfuser'
            ], Response::HTTP_FORBIDDEN);

        } else {
            $requestValue = $request->validated();
    
            $filename = time() . '.' . $requestValue['file']->extension();
    
            /**
             * upload du photos ou videos ou plus
             */
            $requestValue['file']->storeAs(
                'formations', // dossier d destination path padawan_project/public/photos/formations,
                $filename,
                'uploadFormation' // clé de valeur qui permet l'upload des fichier, config/filesystems.php
            );
    
            $createFormation = Formation::create([
                'nom' => $requestValue['nom'],
                'file' => $filename,
                'coeur' => 0,
                'is_premium' => $requestValue['is_premium'],
                'langue' => $requestValue['langue'],
                'share' => 0,
                'user_id' => Auth::user()->id,
            ]);
    
            return response()->json([
                'formation' => $createFormation
            ], Response::HTTP_CREATED);
        }
    }

    /**
     * update Formation
     *
     * @param UpadteFormationRequest $request
     * @param int $id
     * @return JsonResponse
     **/
    public function updateFormation(UpadteFormationRequest $request, int $id)
    {
        /**
         * teste si l'user est un mentor ou pas
         */
        if (!Gate::allows('allow_mentor')) {

            return response()->json([
                'message' => 'Action réfuser'
            ], Response::HTTP_FORBIDDEN);

        } else {

            /**
             * teste si la formation apartien au mentor authentifier
             */
            if (Formation::findOrFail($id)->user_id === Auth::user()->id) {
                $requestValue = $request->validated();
    
                $formation = Formation::where('id', $id);
    
                $formation->update([
                    'nom' => $requestValue['nom'],
                    'is_premium' => $requestValue['is_premium'],
                    'langue' => $requestValue['langue'],
                ]);

                return response()->json([
                    'formation' => $formation->get()
                ], Response::HTTP_OK);
            } else {
                return response()->json([
                    'message' => 'Action Non autoriser'
                ], Response::HTTP_UNAUTHORIZED);
            }

        }
    }

    /**
     * add like in Formation
     *
     * @param AddLikeFormationRequest $request
     * @param int $id
     * @return JsonResponse
     **/
    public function addLike(AddLikeFormationRequest $request, int $id)
    {
        $requestValue = $request->validated();
        $formationId = Formation::findOrFail($id)->id;
        
        /**
         * verifie si l'user a deja liker la formation ou pas
         */
        $verification = userFormation::where('user_id', Auth::user()->id)->where('formation_id', $formationId)->first();

        if ($verification !== null) {
            if ($verification->liked === 1) {
                $userFormationUpdated = userFormation::where('user_id', Auth::user()->id)->where('formation_id', $formationId);
                
                $userFormationUpdated->update([
                    'liked' => false
                ]);
                
                $countLike = DB::select('SELECT coeur AS likes FROM formations WHERE id = '. $formationId);
                
                $totalLike = ($countLike[0]->likes -1);
    
                $formationToUpdateLike = Formation::where('id', $formationId);
    
                $formationToUpdateLike->update([
                    'coeur' => $totalLike
                ]);
    
                return response()->json([
                    'formation' => $formationToUpdateLike->get()
                ], Response::HTTP_OK);
            } else {
                $userFormationUpdated = userFormation::where('user_id', Auth::user()->id)->where('formation_id', $formationId);
                
                $userFormationUpdated->update([
                    'liked' => true
                ]);
                
                $countLike = DB::select('SELECT coeur AS likes FROM formations WHERE id = '. $formationId);
                
                $totalLike = ($countLike[0]->likes + 1);
    
                $formationToUpdateLike = Formation::where('id', $formationId);
    
                $formationToUpdateLike->update([
                    'coeur' => $totalLike
                ]);
    
                return response()->json([
                    'formation' => $formationToUpdateLike->get()
                ], Response::HTTP_OK);
            }
        } else {
            // when user click the like button
            userFormation::create([
                'user_id' => Auth::user()->id,
                'formation_id' => $formationId,
                'liked' => $requestValue['liked']
            ]);

            $countLike = DB::select('SELECT count(user_id) AS likes FROM user_formation WHERE formation_id = '. $formationId. ' AND liked = 1');
            
            $formationToUpdateLike = Formation::where('id', $formationId);

            $formationToUpdateLike->update([
                'coeur' => $countLike[0]->likes
            ]);

            return response()->json([
                'formation' => $formationToUpdateLike->get()
            ], Response::HTTP_OK);
        }
    }

    /**
     * search formation
     *
     * @param SearchFormationRequest $request
     * @return JsonResponse
     **/
    public function searchFormation(SearchFormationRequest $request)
    {
        $requestValue = $request->validated();

        $formation = Formation::where('nom', 'LIKE', '%'.$requestValue['search'].'%')->orWhere('langue', 'LIKE', '%'.$requestValue['search'].'%')->orWhere('is_premium', 'LIKE', '%'.$requestValue['search'].'%')->get();

        return response()->json([
            'formation' => $formation
        ], Response::HTTP_OK);
    }
}
