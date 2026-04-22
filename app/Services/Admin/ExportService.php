<?php

namespace App\Services\Admin;

use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportService
{
    /**
     * @param  string  $exportClass  The FQCN of the export class
     * @param  array<string, mixed>  $filters  Form filters
     * @param  string  $fileName  Output file name
     */
    public function export(string $exportClass, array $filters, string $fileName): BinaryFileResponse
    {
        return Excel::download(new $exportClass($filters), $fileName);
    }
}
