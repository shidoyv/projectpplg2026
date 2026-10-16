<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KaryaBatik extends Model
{
    use HasFactory;

    protected $table = 'karya_batik';

    protected $fillable = [
        'user_id',
        'nama_kain',
        'filosofi_karya',
        'file_gambar_url',
        'palet_warna',
        'motif',
        'pembuat',
        'is_publik',
    ];

    protected $casts = [
        'palet_warna' => 'array',
        'is_publik' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}