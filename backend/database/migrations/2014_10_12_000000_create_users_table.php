<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            // $table->text('photos')->nullable();
            // $table->text('langue')->nullable();
            // $table->text('description')->nullable();
            // $table->text('biographie')->nullable();
            // $table->boolean('is_disponible')->nullable();
            // $table->boolean('is_mentor')->default(false);
            // $table->integer('etoile')->nullable();
            // $table->integer('etudiant_total')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->smallInteger('role')->default(0);
            // $table->string('situation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
