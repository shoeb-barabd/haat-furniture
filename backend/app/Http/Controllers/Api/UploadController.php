<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $file = $request->file('file');
        if (! $file || ! $file->isValid()) {
            return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
        }

        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        if (! in_array($ext, $allowed, true)) {
            return response()->json(['success' => false, 'message' => 'Only jpg, png, webp, gif, svg allowed'], 400);
        }

        if ($file->getSize() > 8 * 1024 * 1024) {
            return response()->json(['success' => false, 'message' => 'File too large (max 8MB)'], 400);
        }

        $dir = base_path('../frontend/storage/uploads');
        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return response()->json(['success' => false, 'message' => 'Could not create upload folder'], 500);
        }

        $base = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'image';
        $filename = $base.'-'.time().'.'.$ext;
        $file->move($dir, $filename);

        return response()->json([
            'success' => true,
            'url' => '/uploads/'.$filename,
            'filename' => $filename,
        ]);
    }
}
