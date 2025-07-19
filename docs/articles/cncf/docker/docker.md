# Docker

## 命令

```bash
# docker 磁盘占用
docker system df
docker system df -v # 详情
docker system df -f # 强制删除
# 清理已停止/未被任何容器使用的卷/未被任何容器所关联的网络/所有悬空的镜像
docker system prune
docker system prune -a # 一并清除所有未被使用的镜像和

# 清理未使用的 image/container/volume/network
# 其中 container 包括所有处于 stopped 状态的容器
docker image/container/volume/network prune
# 清理所有没有使用的 image
docker image prune -a

# 设置容器日志大小
# 单个容器设置 (docker-compose)
nginx:
  image: nginx:1.12.1
  restart: always
  logging:
    driver: “json-file”
    options:
      max-size: “1024m”

# 全局设置
# /etc/docker/daemon.json
{
  "log-driver":"json-file",
  "log-opts": {"max-size":"128m", "max-file":"7"}
}

systemctl daemon-reload && systemctl restart docker
```
