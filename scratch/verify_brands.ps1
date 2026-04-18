$SUPABASE_URL = "https://ihlzgwuzqzdhijwnljtu.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobHpnd3V6cXpkaGlqd25sanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODQ2NDQsImV4cCI6MjA5MjA2MDY0NH0.CANH1jSIfe92sXIa45j0T5b9SJrpchjZ8Ps3DLvmQro"

$Headers = @{
    "apikey"        = $SUPABASE_KEY
    "Authorization" = "Bearer $SUPABASE_KEY"
}

$response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/brands?select=name,image_url" -Method Get -Headers $Headers
Write-Host "Total brands in DB: $($response.Count)"
$response | ForEach-Object { Write-Host "  - $($_.name)" }
