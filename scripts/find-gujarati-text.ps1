# Script to find remaining hardcoded Gujarati text in the codebase
# Usage: powershell -ExecutionPolicy Bypass -File scripts/find-gujarati-text.ps1

Write-Host "🔍 Searching for hardcoded Gujarati text in the codebase..." -ForegroundColor Cyan
Write-Host ""

# Gujarati Unicode range pattern
$gujaratiPattern = "[\u0A80-\u0AFF]"

Write-Host "📁 Files containing Gujarati text:" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow

# Find files containing Gujarati text
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts","*.jsx","*.js" | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "gujaratiStrings.ts" } |
    Where-Object { (Get-Content $_.FullName -Raw) -match $gujaratiPattern } |
    Select-Object -ExpandProperty FullName |
    Sort-Object

foreach ($file in $files) {
    $relativePath = $file -replace [regex]::Escape($PWD.Path + "\"), ""
    Write-Host $relativePath -ForegroundColor White
}

Write-Host ""
Write-Host "📊 Detailed occurrences:" -ForegroundColor Yellow
Write-Host "=======================" -ForegroundColor Yellow

# Show detailed occurrences (first 50)
$count = 0
Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts","*.jsx","*.js" | 
    Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "gujaratiStrings.ts" } |
    ForEach-Object {
        $file = $_
        $relativePath = $file.FullName -replace [regex]::Escape($PWD.Path + "\"), ""
        $lineNumber = 0
        Get-Content $file.FullName | ForEach-Object {
            $lineNumber++
            if ($_ -match $gujaratiPattern -and $count -lt 50) {
                Write-Host "${relativePath}:${lineNumber}: $_" -ForegroundColor Gray
                $count++
            }
        }
    }

Write-Host ""
Write-Host "✅ Search complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  - Files listed above need to be migrated" -ForegroundColor White
Write-Host "  - See MIGRATION_GUIDE.md for step-by-step instructions" -ForegroundColor White
Write-Host "  - Use QUICK_REFERENCE.md to find the right constants" -ForegroundColor White
Write-Host ""
