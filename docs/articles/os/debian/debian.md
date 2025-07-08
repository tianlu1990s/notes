# Debian

## 1. 操作系统基础

### 1.1 网络

**系统**

```bash
# CPU 信息
cat /proc/cpuinfo

# crontab
systemctl restart crond.service
```

**网络**

```bash
# 网络状态查看
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

### 1.2 常用工具

```bash
# tar 加密打包压缩
tar -czvf - FILE_NAME | openssl des3 -salt -k PASSWORD -out FILE_NAME.TAR.GZ

openssl des3 -d -k PASSWORD -salt -in FILE_NAME.TAR.GZ | tar xzf - FILE_NAME
```

```bash
# UNIX BENCH
git clone https://gitee.com/songtianlun/byte-unixbench && cd byte-unixbench/UnixBench && make && ./Run
```

```bash
# yum 锁定版本
# 示例 /etc/yum.repos.d/docker-ce.repo
exclude=docker-*
```

### 1.3 Debian

```bash
# 替换 vi /etc/apt/source.list

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-updates main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bullseye-backports main contrib non-free
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bullseye-security main contrib non-free
# deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security bullseye-security main contrib non-free

# apt update

wsl -d Debian -u root -e /etc/init.d/ssh start

# 添加 admin
# 创建用户并跳过密码设置（禁止密码登录）
sudo useradd -m -s /bin/bash admin

# 将用户加入 sudo 组
sudo usermod -aG sudo admin

# 验证用户组
groups admin  # 应显示 admin sudo

# 创建专用配置文件（使用 visudo 保证语法安全）
sudo visudo -f /etc/sudoers.d/99-admin-nopasswd

# 添加内容
# 允许 admin 免密执行所有命令
admin ALL=(ALL:ALL) NOPASSWD: ALL
# 允许免密切换到其他用户（如 root）
admin ALL=(ALL) NOPASSWD: /bin/su - *

```

### FAQ

```bash
# 查看监听端口 backlog
sudo ss -lntp
# ListenOverflows ListenDrops 监听队列溢出
#
cat /proc/net/netstat
```