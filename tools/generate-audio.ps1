# Offline TTS audio generation (fallback for browsers without Web Speech TTS).
# Scans english/data-*.js for word entries, plus fixed phrases,
# outputs english/audio/{slug}.wav using Microsoft Zira (en-US).
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$audioDir = Join-Path $root 'english\audio'
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null

# word entries: en:'x',zh: pattern (scene names use zh before en, so they are excluded)
$words = New-Object System.Collections.Generic.HashSet[string]
Get-ChildItem -Path (Join-Path $root 'english') -Filter 'data-*.js' | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  foreach ($m in [regex]::Matches($content, "en:'([^']+)',zh:")) {
    [void]$words.Add($m.Groups[1].Value)
  }
}

$phrases = [ordered]@{
  'great-job'                 = 'Great job!'
  'bye-bye'                   = 'Bye bye!'
  'knock-knock-whats-inside'  = "Knock knock! What's inside?"
  'whats-inside'              = "What's inside?"
}

function Slug([string]$t) {
  return ($t.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
}

$gen = New-Object System.Speech.Synthesis.SpeechSynthesizer
$zira = $gen.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like '*Zira*' } | Select-Object -First 1
if ($zira) { $gen.SelectVoice($zira.VoiceInfo.Name) }
$gen.Rate = -2

$count = 0
foreach ($w in $words) {
  $file = Join-Path $audioDir ((Slug $w) + '.wav')
  $gen.SetOutputToWaveFile($file)
  $gen.Speak($w)
  $gen.SetOutputToNull()
  $count++
}
foreach ($k in $phrases.Keys) {
  $file = Join-Path $audioDir ($k + '.wav')
  $gen.SetOutputToWaveFile($file)
  $gen.Speak($phrases[$k])
  $gen.SetOutputToNull()
  $count++
}
Write-Output ("Generated {0} files -> {1}" -f $count, $audioDir)
