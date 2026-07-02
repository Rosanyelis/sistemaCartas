<?php

return [
    'image' => [
        'format' => 'webp',
        'max_width' => 1920,
        'max_height' => 1920,
        'webp_quality' => 82,
        'max_upload_kb' => 5120,
    ],
    'video' => [
        'max_upload_kb' => 10240,
        'max_output_bytes' => 10 * 1024 * 1024,
        'max_width' => 1280,
        'crf' => 28,
        'audio_bitrate_kbps' => 128,
        'allowed_mimetypes' => ['video/mp4', 'video/quicktime'],
        'ffmpeg_binaries' => env('FFMPEG_BINARIES', 'ffmpeg'),
        'ffprobe_binaries' => env('FFPROBE_BINARIES', 'ffprobe'),
    ],
    'audio' => [
        'max_upload_kb' => 51200,
        'allowed_mimetypes' => ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/ogg'],
        'qr_logo_path' => public_path('images/hero-image.webp'),
        'qr_size' => 512,
    ],
];
