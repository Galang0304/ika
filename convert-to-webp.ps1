# PowerShell script untuk mengkonversi JPG ke WebP
# Menggunakan System.Drawing untuk konversi sederhana

Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\andia\Documents\ika\assets"
$jpgFiles = Get-ChildItem -Path $sourceDir -Filter "*.jpg"

foreach ($file in $jpgFiles) {
    $webpName = $file.BaseName + ".webp"
    $webpPath = Join-Path $sourceDir $webpName
    
    Write-Host "Converting $($file.Name) to $webpName"
    
    # Load dan save image dengan kualitas terbaik yang bisa
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    
    # Coba save dengan format terbaik yang ada
    try {
        # Untuk sementara copy dengan nama .webp (browser akan fallback ke JPG)
        Copy-Item $file.FullName $webpPath -Force
        Write-Host "Created placeholder: $webpName" -ForegroundColor Green
    }
    catch {
        Write-Host "Error creating $webpName`: $_" -ForegroundColor Red
    }
    finally {
        if ($image) { $image.Dispose() }
    }
}

Write-Host "`nNote: File telah di-copy dengan ekstensi .webp untuk placeholder." -ForegroundColor Yellow
Write-Host "Untuk konversi real WebP, gunakan tools seperti:" -ForegroundColor Yellow
Write-Host "- Online converter (squoosh.app, convertio.co)" -ForegroundColor Yellow
Write-Host "- Download cwebp dari Google WebP tools" -ForegroundColor Yellow
Write-Host "- Gunakan GIMP atau Photoshop dengan WebP plugin" -ForegroundColor Yellow
