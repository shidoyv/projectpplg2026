<?php

namespace App\Http\Controllers;

use App\Models\KaryaBatik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StudioCantingController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) $request->query('limit', 30);
        $motif = $request->query('motif');

        $query = KaryaBatik::where('is_publik', true)->orderBy('created_at', 'desc');

        if ($motif) {
            $query->where('motif', $motif);
        }

        $artworks = $query->paginate($limit);

        return response()->json([
            'status' => 'success',
            'data' => $artworks->items(),
            'pagination' => [
                'current_page' => $artworks->currentPage(),
                'last_page' => $artworks->lastPage(),
                'total' => $artworks->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_kain' => 'required|string|min:2|max:150',
            'filosofi_karya' => 'required|string|min:5|max:2000',
            'palet_warna' => 'nullable',
            'motif' => 'nullable|string|max:80',
            'pembuat' => 'nullable|string|max:100',
            'gambar_base64' => 'required_without:gambar_file|string',
            'gambar_file' => 'required_without:gambar_base64|file|image|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal, silakan periksa data karya Anda.',
                'errors' => $validator->errors()
            ], 422);
        }

        $filename = 'batik_' . date('Ymd_His') . '_' . Str::random(8) . '.png';
        $directory = 'batik';

        Storage::disk('public')->makeDirectory($directory);

        if ($request->hasFile('gambar_file')) {
            $file = $request->file('gambar_file');
            $path = $file->storeAs($directory, $filename, 'public');
        } elseif ($request->filled('gambar_base64')) {
            $base64Data = $request->input('gambar_base64');
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
            }

            $decoded = base64_decode($base64Data);
            if ($decoded === false) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Format gambar kain tidak valid atau gagal didekode.'
                ], 400);
            }

            Storage::disk('public')->put($directory . '/' . $filename, $decoded);
            $path = $directory . '/' . $filename;
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Berkas gambar kanvas batik tidak ditemukan.'
            ], 400);
        }

        $paletWarna = $request->input('palet_warna');
        if (is_string($paletWarna)) {
            $decodedJson = json_decode($paletWarna, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $paletWarna = $decodedJson;
            } else {
                $paletWarna = array_filter(array_map('trim', explode(',', $paletWarna)));
            }
        }

        $userId = auth()->id() ?? null;
        $pembuat = $request->input('pembuat');
        if (!$pembuat) {
            $pembuat = auth()->check() ? auth()->user()->name : 'Pengrajin Lelana';
        }

        $karya = KaryaBatik::create([
            'user_id' => $userId,
            'nama_kain' => trim($request->input('nama_kain')),
            'filosofi_karya' => trim($request->input('filosofi_karya')),
            'file_gambar_url' => 'storage/' . $path,
            'palet_warna' => $paletWarna,
            'motif' => $request->input('motif', 'Kreasi Bebas'),
            'pembuat' => $pembuat,
            'is_publik' => $request->boolean('is_publik', true),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Karya batik berhasil disimpan dan dipamerkan!',
            'data' => $karya
        ], 201);
    }

    public function show($id)
    {
        $karya = KaryaBatik::find($id);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya batik tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $karya
        ]);
    }

    public function destroy($id)
    {
        $karya = KaryaBatik::find($id);

        if (!$karya) {
            return response()->json([
                'status' => 'error',
                'message' => 'Karya batik tidak ditemukan.'
            ], 404);
        }

        if (auth()->check() && $karya->user_id && $karya->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki hak untuk menghapus karya ini.'
            ], 403);
        }

        $filePath = str_replace('storage/', '', $karya->file_gambar_url);
        Storage::disk('public')->delete($filePath);

        $karya->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Karya batik berhasil dihapus.'
        ]);
    }
}