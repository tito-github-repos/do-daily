$url = "http://localhost:3000/api/register"

function Send-Test {
  param([string]$Label, [hashtable]$Payload)

  Write-Host ""
  Write-Host "=== $Label ===" -ForegroundColor Cyan
  $json = $Payload | ConvertTo-Json -Compress

  try {
    $res = Invoke-WebRequest -Uri $url -Method POST -ContentType "application/json" -Body $json -UseBasicParsing
    Write-Host "Status: $($res.StatusCode)"
    Write-Host $res.Content
  }
  catch {
    $resp = $_.Exception.Response
    if ($resp) {
      Write-Host "Status: $([int]$resp.StatusCode)"
      $text = $_.ErrorDetails.Message
      if (-not $text) {
        try {
          $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
          $text = $reader.ReadToEnd()
        } catch { $text = "(could not read response body)" }
      }
      Write-Host $text
    }
    else {
      Write-Host "Request failed: $($_.Exception.Message)" -ForegroundColor Red
      Write-Host "Is 'npm run dev' running on port 3000?" -ForegroundColor Yellow
    }
  }
}

Send-Test "1. Valid registration" @{
  name           = "Test User"
  email          = "test@example.com"
  phone          = "+91 98765 43210"
  website        = ""
  turnstileToken = "XXXX.DUMMY.TOKEN.XXXX"
}

Send-Test "2. Bad email" @{
  name           = "Test User"
  email          = "nope"
  phone          = "9876543210"
  website        = ""
  turnstileToken = "x"
}

Send-Test "3. Honeypot filled" @{
  name           = "Bot"
  email          = "bot@example.com"
  phone          = "9876543210"
  website        = "http://spam.com"
  turnstileToken = "x"
}

Send-Test "4. Missing Turnstile token" @{
  name    = "Test User"
  email   = "test2@example.com"
  phone   = "9876543210"
  website = ""
}