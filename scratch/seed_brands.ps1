$SUPABASE_URL = "https://ihlzgwuzqzdhijwnljtu.supabase.co"
$SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobHpnd3V6cXpkaGlqd25sanR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODQ2NDQsImV4cCI6MjA5MjA2MDY0NH0.CANH1jSIfe92sXIa45j0T5b9SJrpchjZ8Ps3DLvmQro"

$Headers = @{
    "apikey"        = $SUPABASE_KEY
    "Authorization" = "Bearer $SUPABASE_KEY"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=minimal"
}

Write-Host "Step 1: Clearing the brands table..." -ForegroundColor Yellow

# Delete all existing brands
$deleteUrl = "$SUPABASE_URL/rest/v1/brands?id=neq.00000000-0000-0000-0000-000000000000"
Invoke-RestMethod -Uri $deleteUrl -Method Delete -Headers $Headers
Write-Host "  Done! Table cleared." -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Inserting 17 brands..." -ForegroundColor Yellow

$brands = @(
    @{ name = "Snap-on";         image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Snap-on_logo.svg/1200px-Snap-on_logo.svg.png" },
    @{ name = "Blue-Point";      image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Blue_Point_logo.svg/1200px-Blue_Point_logo.svg.png" },
    @{ name = "BAHCO";           image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bahco_logo.svg/1200px-Bahco_logo.svg.png" },
    @{ name = "WILLIAMS";        image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Williams_Tools_logo.svg/1200px-Williams_Tools_logo.svg.png" },
    @{ name = "SIOUX";           image_url = "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sioux-Logo.jpg" },
    @{ name = "STANLEY";         image_url = "https://logos-world.net/wp-content/uploads/2022/02/Stanley-Logo.png" },
    @{ name = "DEWALT";          image_url = "https://logos-world.net/wp-content/uploads/2020/12/DeWalt-Logo.png" },
    @{ name = "BLACK & DECKER";  image_url = "https://logos-world.net/wp-content/uploads/2021/02/Black-Decker-Logo.png" },
    @{ name = "LENOX";           image_url = "https://upload.wikimedia.org/wikipedia/commons/f/f6/Lenox_logo.svg" },
    @{ name = "LINDSTROM";       image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Lindstrom_logo_RGB.png/1200px-Lindstrom_logo_RGB.png" },
    @{ name = "GROZ";            image_url = "https://groz-tools.com/wp-content/uploads/2021/01/groz-logo.png" },
    @{ name = "KNIPEX";          image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Knipex_logo.svg/1200px-Knipex_logo.svg.png" },
    @{ name = "Wera";            image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Wera_Logo.svg/1200px-Wera_Logo.svg.png" },
    @{ name = "RENNSTEIG";       image_url = "https://www.rennsteig.com/wp-content/uploads/2020/01/rennsteig-logo.png" },
    @{ name = "MUVTONS";         image_url = "https://muvtons.com/wp-content/uploads/2022/03/Muvtons-Logo.png" },
    @{ name = "Lubeco";          image_url = "https://lubecogreenfluids.com/wp-content/uploads/2021/08/lubeco-logo.png" },
    @{ name = "CRC";             image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/CRC_logo.svg/1200px-CRC_logo.svg.png" }
)

$insertUrl = "$SUPABASE_URL/rest/v1/brands"

foreach ($brand in $brands) {
    $body = $brand | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri $insertUrl -Method Post -Headers $Headers -Body $body
        Write-Host "  + Inserted: $($brand.name)" -ForegroundColor Cyan
    } catch {
        Write-Host "  ! Failed: $($brand.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All done! Verifying count..." -ForegroundColor Yellow
$countHeaders = @{
    "apikey"        = $SUPABASE_KEY
    "Authorization" = "Bearer $SUPABASE_KEY"
    "Prefer"        = "count=exact"
}
$response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/brands?select=*" -Method Get -Headers $countHeaders -ResponseHeadersVariable resHeaders
Write-Host "  Total brands in DB: $($response.Count)" -ForegroundColor Green
