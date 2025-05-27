<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UserUpdateEtudiantRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    /*  Etudiant et mentor sont dans une seule table, 
        la difference c'est juste leur information remplie
        par exemple dans la table user, si il est un mentor alor is_mentor = true
        et seule les infromation qui correspond au mentor seront remplie, les autre null
    */

    /**
     * Display a authenticated user info
     * 
     * @return JsonResponse
     */
    public function getAuthenticatedUser()
    {
        $user = Auth::user();

        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    /**
     * Display one user information
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function getOtherUser(int $id)
    {
        $oneUser = User::findOrFail($id);

        return response()->json([
            'oneUser' => $oneUser
        ], Response::HTTP_OK);
    }

    /**
     * Display all mentor
     *
     * @return JsonResponse
     **/
    public function getAllMentor()
    {
        $allOtherUser = User::where('is_mentor', '=', 1)->get();

        return response()->json([
            'mentors' => $allOtherUser
        ], Response::HTTP_OK);
    }

    /**
     * Display all etudiant
     *
     * @return JsonResponse
     **/
    public function getAllEtudiant()
    {
        $allOtherUser = User::where('is_mentor', '=', 0)->get();

        return response()->json([
            'etudiants' => $allOtherUser
        ], Response::HTTP_OK);
    }

    /**
     * update the user authenticated basic info.
     * 
     * le Gate est un systeme de securiter, son action est d'empecher
     * les utilisateur de mettre a jour les profile des autre utilisateur,
     * donc c'est le profile de l'utilisateur lui meme qu'il peut mettre a jour
     * 
     * @param UpdateUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateUser(UpdateUserRequest $request, int $id)
    {
        if (!Gate::allows('allow_user', $id)) {

            return response()->json([
                'message' => 'Action non autoriser'
            ], Response::HTTP_FORBIDDEN);
        } else {

            $userToUpdate = User::where('id', $id);
            $requestValue = $request->validated();
    
            $userToUpdate->update([
                'nom' => $requestValue['nom'],
                'prenom' => $requestValue['prenom'],
                'photos' => $requestValue['photos'],
                'langue' => $requestValue['langue'],
                'description' => $requestValue['description'],
            ]);
    
            return response()->json([
                'message' => 'Profile updated',
                'user' => $userToUpdate->get()
            ], Response::HTTP_OK);
        }
        
    }

    /**
     * update the user authenticated basic info.
     * 
     * le Gate est un systeme de securiter, son action est d'empecher
     * les utilisateur de mettre a jour les profile des autre utilisateur,
     * donc c'est le profile de l'utilisateur lui meme qu'il peut mettre a jour
     * 
     * @param UpdateUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateUserEtudiant(UserUpdateEtudiantRequest $request, int $id)
    {
        if (!Gate::allows('allow_user', $id)) {

            return response()->json([
                'message' => 'Action non autoriser'
            ], Response::HTTP_FORBIDDEN);
        } else {

            $userToUpdate = User::where('id', $id);
            $requestValue = $request->validated();
    
            $userToUpdate->update([
                'nom' => $requestValue['nom'],
                'prenom' => $requestValue['prenom'],
                'photos' => $requestValue['photos'],
                'langue' => $requestValue['langue'],
                'biographie' => $requestValue['biographie'],
                'situation' => $requestValue['situation'],
            ]);
    
            return response()->json([
                'message' => 'Profile updated',
                'user' => $userToUpdate->get()
            ], Response::HTTP_OK);
        }
        
    }
    
    /**
     * Display a searched user
     *
     * @param SearchUserRequest $request
     * @return JsonResponse
     **/
    public function searchUser(SearchUserRequest $request)
    {
        $requestValue = $request->validated();

        $users = User::where('nom', 'LIKE', '%' . $requestValue['search'] . '%')->orWhere('prenom', 'LIKE', '%' . $requestValue['search'] . '%')->get();

        return response()->json([
            'search' => $users
        ], Response::HTTP_OK);
    }
}
