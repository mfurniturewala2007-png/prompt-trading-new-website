$SUPABASE_URL = "https://ihlzgwuzqzdhijwnljtu.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobHpnd3V6cXpkaGlqd25sanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODQ2NDQsImV4cCI6MjA5MjA2MDY0NH0.CANH1jSIfe92sXIa45j0T5b9SJrpchjZ8Ps3DLvmQro"

$Headers = @{
    "apikey"        = $SUPABASE_KEY
    "Authorization" = "Bearer $SUPABASE_KEY"
    "Content-Type"  = "application/json"
}

# Create the brand-logos storage bucket
Write-Host "Creating 'brand-logos' storage bucket..." -ForegroundColor Yellow

$bucketBody = @{
    id         = "brand-logos"
    name       = "brand-logos"
    public     = $true
} | ConvertTo-Json

try {
    $result = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" -Method Post -Headers $Headers -Body $bucketBody
    Write-Host "  Bucket created successfully!" -ForegroundColor Green
    $result | ConvertTo-Json
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 409) {
        Write-Host "  Bucket 'brand-logos' already exists. Good!" -ForegroundColor Cyan
    } else {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Status: $statusCode" -ForegroundColor Red
    }
}
