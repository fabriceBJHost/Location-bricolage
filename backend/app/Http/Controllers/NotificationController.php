<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
    public function getNotification()
    {
        $Notification = Notification::where('id_client', Auth::user()->id)
            ->orderBy('id', 'DESC')->get();

        return response()->json([
            'notification' => $Notification
        ], Response::HTTP_OK);
    }

    public function createNotification(int $idClient, string $content)
    {
        Notification::create([
            'id_client' => $idClient,
            'description' => $content
        ]);
    }

    public function makeSeen(int $id)
    {
        $notification = Notification::where('id', $id);

        if (Notification::findOrFail($id)) {
            $notification->update([
                'seen' => true
            ]);
        }

        return response()->json([
            'message' => "mark as read"
        ], Response::HTTP_OK);
    }

    public function seenAll()
    {
        $notification = Notification::where('seen', false)->where('id_client', Auth::user()->id);

        $notification->update([
            'seen' => true
        ]);

        return response()->json([
            'message' => "mark all as read"
        ], Response::HTTP_OK);

    }

    public function countNotification()
    {
        $notification = Notification::where("seen", false)
        ->where('id_client', Auth::user()->id)
        ->count();

        return response()->json([
            'count' => $notification
        ], Response::HTTP_OK);
    }
}
