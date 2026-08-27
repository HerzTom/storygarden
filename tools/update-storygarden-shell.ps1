param([string]$ProjectRoot=(Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)
$chapterNames=@{
  '01'='AI 发展简史';'02'='大模型核心原理';'03'='主流大模型全景';'04'='大模型关键能力';
  '05'='智能体深度解析';'06'='MCP 与 Agent 生态';'07'='智能体框架与平台';'08'='大模型与智能体协同';
  '09'='实际应用场景';'10'='安全治理与伦理';'11'='前沿趋势与未来';'12'='术语与学习资源'
}

function Clean-Text([string]$value){
  if(!$value){return ''}
  $text=[regex]::Replace($value,'<[^>]+>',' ')
  $text=[System.Net.WebUtility]::HtmlDecode($text)
  return ([regex]::Replace($text,'\s+',' ')).Trim()
}

function Get-MatchText([string]$html,[string]$pattern){
  $match=[regex]::Match($html,$pattern,[Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if($match.Success){return Clean-Text $match.Groups[1].Value}
  return ''
}

function Get-PageConfig([string]$relative,[string]$title,[string]$h1){
  $file=[IO.Path]::GetFileName($relative)
  $folder=[IO.Path]::GetDirectoryName($relative)
  $display=if($h1){$h1}else{$title -replace '\s*[|·].*$',''}
  if($relative -eq 'index.html'){
    return @{Section='home';Topic='StoryGarden';Title='StoryGarden';Root='.';Home=$true;Parent='';ParentLabel=''}
  }
  if($folder -eq 'artificial-intelligence'){
    if($file -eq 'ArtificialIntelligence.html'){
      return @{Section='ai';Topic='人工智能';Title='AI 大模型与智能体知识库';Root='..';Home=$false;Parent='../index.html';ParentLabel='返回 StoryGarden'}
    }
    if($file -match '^ch-(\d{2})\.html$'){
      return @{Section='ai';Topic='人工智能';Title=$display;Root='..';Home=$false;Parent='ArtificialIntelligence.html';ParentLabel='返回 AI 知识总览'}
    }
    if($file -match '^art-(\d{2})-\d{2}\.html$'){
      $chapter=$Matches[1]
      return @{Section='ai';Topic=('人工智能 · '+$chapterNames[$chapter]);Title=$display;Root='..';Home=$false;Parent=('ch-'+$chapter+'.html');ParentLabel=('返回 '+$chapterNames[$chapter])}
    }
  }
  if($folder -eq 'high-concurrency'){
    if($file -eq 'high-concurrency.html'){
      return @{Section='high-concurrency';Topic='高并发系统设计';Title='高并发系统设计';Root='..';Home=$false;Parent='../index.html';ParentLabel='返回 StoryGarden'}
    }
    return @{Section='high-concurrency';Topic='高并发系统设计';Title=$display;Root='..';Home=$false;Parent='high-concurrency.html';ParentLabel='返回高并发总览'}
  }
  if($folder -eq 'Long-TailEffect'){
    return @{Section='longtail';Topic='长尾效应';Title=$display;Root='..';Home=$false;Parent='../index.html';ParentLabel='返回 StoryGarden'}
  }
  if($folder -eq 'netflix-culture'){
    if($file -eq 'index.html'){
      return @{Section='netflix';Topic='奈飞文化手册';Title='奈飞文化手册';Root='..';Home=$false;Parent='../index.html';ParentLabel='返回 StoryGarden'}
    }
    if($file -match '^val-'){
      return @{Section='netflix';Topic='奈飞文化手册 · 价值观';Title=$display;Root='..';Home=$false;Parent='values.html';ParentLabel='返回价值观总览'}
    }
    return @{Section='netflix';Topic='奈飞文化手册';Title=$display;Root='..';Home=$false;Parent='index.html';ParentLabel='返回手册首页'}
  }
  if($folder -eq 'fighting-against-disorder'){
    if($file -eq 'index.html'){
      return @{Section='disorder';Topic='对抗无序';Title='对抗无序';Root='..';Home=$false;Parent='../index.html';ParentLabel='返回 StoryGarden'}
    }
    return @{Section='disorder';Topic='对抗无序';Title=$display;Root='..';Home=$false;Parent='index.html';ParentLabel='返回对抗无序'}
  }
  return @{Section='home';Topic='StoryGarden';Title=$display;Root='.';Home=$false;Parent='index.html';ParentLabel='返回 StoryGarden'}
}

$search=@()
$files=Get-ChildItem -LiteralPath $ProjectRoot -Recurse -Filter '*.html' | Sort-Object FullName
foreach($file in $files){
  if($file.FullName -like "$ProjectRoot\assets\*"){continue}
  $relative=$file.FullName.Substring($ProjectRoot.Length+1).Replace('\','/')
  $html=[IO.File]::ReadAllText($file.FullName)
  $html=[regex]::Replace($html,'<body-label="[^"]*"\s*','<body ',[Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $title=Get-MatchText $html '<title>([\s\S]*?)</title>'
  $h1=Get-MatchText $html '<h1\b[^>]*>([\s\S]*?)</h1>'
  $description=Get-MatchText $html '<meta\s+name=["'']description["'']\s+content=["'']([^"'']*)["'']'
  if(!$description){
    $description=Get-MatchText $html '<(?:p|div)\b[^>]*class=["''][^"'']*(?:lead|subtitle|sub|thesis|hook|q)[^"'']*["''][^>]*>([\s\S]*?)</(?:p|div)>'
  }
  $config=Get-PageConfig $relative $title $h1
  $keywords=([regex]::Matches($html,'<h2\b[^>]*>([\s\S]*?)</h2>',[Text.RegularExpressions.RegexOptions]::IgnoreCase) | Select-Object -First 10 | ForEach-Object {Clean-Text $_.Groups[1].Value}) -join ' '

  $assetPrefix=if($config.Root -eq '.'){'assets'}else{'../assets'}
  if($html -notmatch 'assets/storygarden\.css'){
    $html=$html -replace '</head>',("<link rel=`"stylesheet`" href=`"$assetPrefix/storygarden.css`">`r`n</head>")
  }
  if($html -notmatch 'assets/search-index\.js'){
    $scripts="<script src=`"$assetPrefix/search-index.js`"></script>`r`n<script src=`"$assetPrefix/storygarden.js`"></script>`r`n"
    $html=$html -replace '</body>',($scripts+'</body>')
  }

  $bodyMatch=[regex]::Match($html,'<body\b([^>]*)>',[Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if(!$bodyMatch.Success){throw "Missing body tag: $relative"}
  $attrs=$bodyMatch.Groups[1].Value
  $attrs=[regex]::Replace($attrs,'\sdata-sg-(?:parent-label|parent|section|title|root|page|home)(?:=(?:"[^"]*"|''[^'']*''|[^\s>]+))?','',[Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $encodedTitle=[System.Net.WebUtility]::HtmlEncode($config.Title)
  $newBody='<body'+$attrs+' data-sg-page data-sg-section="'+$config.Section+'" data-sg-title="'+$encodedTitle+'" data-sg-root="'+$config.Root+'"'
  if($config.Home){$newBody+=' data-sg-home'}
  if($config.Parent){
    $newBody+=' data-sg-parent="'+[System.Net.WebUtility]::HtmlEncode($config.Parent)+'" data-sg-parent-label="'+[System.Net.WebUtility]::HtmlEncode($config.ParentLabel)+'"'
  }
  $newBody+='>'
  $html=$html.Substring(0,$bodyMatch.Index)+$newBody+$html.Substring($bodyMatch.Index+$bodyMatch.Length)
  [IO.File]::WriteAllText($file.FullName,$html,$utf8)

  $search+=[ordered]@{
    path=$relative
    title=$config.Title
    topic=$config.Topic
    summary=if($description){$description}else{($keywords -split ' ' | Select-Object -First 24) -join ' '}
    keywords=$keywords
  }
}

$json=$search | ConvertTo-Json -Compress -Depth 4
[IO.File]::WriteAllText((Join-Path $ProjectRoot 'assets\search-index.js'),('window.STORYGARDEN_SEARCH_INDEX='+$json+';'),$utf8)
Write-Output ("Updated {0} HTML pages and generated {1} search records." -f $files.Count,$search.Count)
