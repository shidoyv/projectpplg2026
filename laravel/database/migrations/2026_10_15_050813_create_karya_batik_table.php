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
        Schema::create('karya_batik', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nama_kain', 150);
            $table->text('filosofi_karya');
            $table->string('file_gambar_url', 255);
            $table->text('palet_warna')->nullable();
            $table->string('motif', 80)->nullable();
            $table->string('pembuat', 100)->default('Pengrajin Anonim');
            $table->boolean('is_publik')->default(true);
            $table->timestamps();

            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('karya_batik');
    }
};
