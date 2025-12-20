param(
    [string]$dockerhubUser,
    [string]$imageName = "tg-telegram-imagebed",
    [string]$tag = "latest",
    [string]$betaTag = "beta1"
)

# 登录 DockerHub
Write-Host "登录 DockerHub..."
docker login --username $dockerhubUser

# 获取 beta tag 自动递增
$repoTags = docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -like "$dockerhubUser/$imageName:beta*" }
if ($repoTags.Count -gt 0) {
    $maxBeta = ($repoTags | ForEach-Object {
        if ($_ -match ":beta(\d+)$") { [int]$matches[1] } else { 0 }
    }) | Measure-Object -Maximum
    $nextBeta = $maxBeta.Maximum + 1
    $betaTag = "beta$nextBeta"
} else {
    $betaTag = "beta1"
}

# 构建 latest 镜像
Write-Host "构建 latest 镜像..."
docker build -t $dockerhubUser/$imageName:latest .

# 构建 beta 镜像
Write-Host "构建 $betaTag 镜像..."
docker build -t $dockerhubUser/$imageName:$betaTag .

# 推送 latest 镜像
Write-Host "推送 latest 镜像..."
docker push $dockerhubUser/$imageName:latest

# 推送 beta 镜像
Write-Host "推送 $betaTag 镜像..."
docker push $dockerhubUser/$imageName:$betaTag

Write-Host "镜像已推送到 DockerHub: $dockerhubUser/$imageName:latest 和 $dockerhubUser/$imageName:$betaTag"