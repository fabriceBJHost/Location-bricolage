<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('allow_user', function(User $user, int $id){
            return $user->id === $id;
        });

        Gate::define('allow_mentor', function(User $user){
            return $user->is_mentor === 1;
        });

        Gate::define('allow_etudiant', function(User $user){
            return $user->is_mentor === 0;
        });
    }
}
