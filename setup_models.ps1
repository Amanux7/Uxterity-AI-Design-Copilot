#!/usr/bin/env pwsh
# setup_models.ps1 — Pull qwen3.5:4b and build the unified UXterity Modelfile
#
# Model: qwen3.5:4b — released March 2026
#   - Multimodal: handles BOTH UI screenshot vision + UX reasoning
#   - Size: 3.4GB VRAM — fits in GTX 1650 (4GB VRAM) with headroom
#   - Context: 256K tokens
#   - One model = simpler setup, no switching overhead
#
# Run from project root: .\setup_models.ps1

Write-Host ""
Write-Host "  UXterity — Model Setup" -ForegroundColor Cyan
Write-Host "  Hardware: GTX 1650 (4GB VRAM) + 8GB RAM" -ForegroundColor DarkCyan
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""

# ── Check Ollama ──────────────────────────────────────────────────────────────
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Ollama not found." -ForegroundColor Red
    Write-Host "  Download from: https://ollama.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "  [1/2] Pulling llama3.2-vision:11b — Vision model (7GB)..." -ForegroundColor Yellow
Write-Host "        Meta's native multimodal vision analyst" -ForegroundColor DarkGray
ollama pull llama3.2-vision:11b

Write-Host ""
Write-Host "  [2/2] Pulling qwen3:4b — Reasoning model (2.5GB)..." -ForegroundColor Yellow
Write-Host "        Latest reasoning model" -ForegroundColor DarkGray
ollama pull qwen3:4b

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host ""
ollama list
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Cyan
Write-Host "  1. ollama serve" -ForegroundColor White
Write-Host "  2. cd backend  -> copy .env.example .env -> uvicorn main:app --reload --port 8000" -ForegroundColor White
Write-Host "  3. cd frontend -> npm run dev" -ForegroundColor White
Write-Host "  4. Open http://localhost:3000 — turn OFF Demo mode to use real AI" -ForegroundColor White
Write-Host ""
Write-Host "  Performance on GTX 1650:" -ForegroundColor DarkGray
Write-Host "    Vision analysis : ~3-6s (fully on GPU)" -ForegroundColor DarkGray
Write-Host "    UX reasoning    : ~3-6s (fully on GPU)" -ForegroundColor DarkGray
Write-Host "    Full pipeline   : ~15-30s end-to-end" -ForegroundColor DarkGray
