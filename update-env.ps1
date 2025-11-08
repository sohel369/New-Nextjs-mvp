# PowerShell script to update .env.local with correct Supabase credentials

Write-Host "🔧 Updating .env.local with correct Supabase credentials..." -ForegroundColor Cyan
Write-Host ""

$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8
SUPABASE_PROJECT_ID=uaijcvhvyurbnfmkqnqt
"@

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "⚠️  .env.local already exists. Creating backup..." -ForegroundColor Yellow
    Copy-Item .env.local .env.local.backup -Force
    Write-Host "✅ Backup created: .env.local.backup" -ForegroundColor Green
}

# Write new content
$envContent | Out-File -FilePath .env.local -Encoding utf8 -NoNewline

Write-Host "✅ .env.local updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host "  2. Configure Supabase Dashboard (see SUPABASE_COMPLETE_FIX.md)" -ForegroundColor White
Write-Host "  3. Run database setup SQL (see SUPABASE_COMPLETE_FIX.md)" -ForegroundColor White
Write-Host ""


