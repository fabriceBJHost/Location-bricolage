<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class userFormation extends Pivot
{
    protected $fillable = [
        'user_id',
        'formation_id',
        'liked',
    ];
}
