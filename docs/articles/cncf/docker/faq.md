# FAQ

1. Docker ulimit 参数

`/usr/lib/systemd/system/docker.service`

2. 性能优化

高负载压力场景使用 Network host
数据卷使用 hostPath, OverlayFS 有性能损失
日志输出写到 hostPath, 使用 docker 标准输出有性能损失 3. Linux container 不退出

`CMD ["tail", "-f", "/dev/null"]`
