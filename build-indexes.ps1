$items = Get-ChildItem -Recurse -File -Include index.html,index.htm |
    ForEach-Object { $_.FullName.Replace((Get-Location).Path + "\","").Replace("\","/") } |
    Sort-Object

$obj = [ordered]@{
  branch = "main"
  base   = "."
  items  = $items
}

($obj | ConvertTo-Json -Depth 3) | Out-File -Encoding utf8 -FilePath "indexes.json"
Write-Host "Generado indexes.json con $($items.Count) entradas."