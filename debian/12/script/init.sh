#!/bin/bash

#set -ev -o pipefail

if [ "$(id -u)" != "0" ]; then
    echo "Please execute this script as root or with sudo privileges!"
    exit 1
fi

echo_blue() {
    echo -e "\033[36m$1\033[0m"
}

echo_red() {
    echo -e "\033[31m$1\033[0m"
}

echo_green() {
    echo -e "\033[32m$1\033[0m"
}

echo_print() {
    echo -e "$1"
}

################################################################################
TIMEZONE='UTC'
DOCKER_VERSION='5:27.3.1-1~debian.12~bookworm'

################################################################################
# Init OS
echo_blue "Init OS ..."

echo_green "apt update and software install"
sudo apt clean && sudo apt autoclean && sudo apt update -q -y && sudo apt upgrade -q -y
sudo apt -q -y install curl iftop htop vim tree chrony unzip net-tools lsof lrzsz
sudo apt-mark hold "linux-image-$(uname -r)"

echo_green "swapoff"
swapoff -a
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

echo_green "vim set"
sed -i '/^# End of file/,$d' /etc/vim/vimrc
cat >>/etc/vim/vimrc <<EOF
# End of file
set nu
set ts=4
set expandtab
set autoindent
set shiftwidth=4
set mouse=""
syntax on
let skip_defaults_vim=1
if has('mouse')
	set mouse-=a
endif
EOF

echo_green "bashrc set"
sed -i '/^# End of file/,$d' /etc/bash.bashrc
cat >>/etc/bash.bashrc <<EOF
# End of file
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias ll='ls -l'
alias dc='docker compose'
alias ds='docker service'
EOF
source /etc/bash.bashrc

echo_green "limit.conf set"
sed -i '/^# End of file/,$d' /etc/security/limits.conf
cat >>/etc/security/limits.conf <<EOF
# End of file
root soft nofile 5242880
root hard nofile 5242880
* soft nofile 5242880
* hard nofile 5242880
* soft nproc 102400
* hard nproc 102400
* soft core unlimited
* hard core unlimited
EOF

echo_green "sysctl.conf set"
sed -i '/^# End of file/,$d' /etc/sysctl.conf
cat >>/etc/sysctl.conf <<EOF
# End of file
fs.file-max = 5242880
fs.nr_open = 5242880
net.ipv4.tcp_tw_reuse = 1
#net.ipv4.tcp_tw_recycle = 1
net.ipv4.ip_local_port_range = 2000 65000
net.ipv4.tcp_mem = 786432 2097152 3145728
net.ipv4.tcp_rmem = 4096 4096 16777216
net.ipv4.tcp_wmem = 4096 4096 16777216

net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_fin_timeout = 60
net.ipv4.tcp_orphan_retries = 2

net.ipv4.tcp_max_syn_backlog = 65536
net.core.somaxconn = 32768

net.netfilter.nf_conntrack_max = 1048576
EOF

echo_green "chronyc set"
timedatectl set-timezone ${TIMEZONE}
chronyc sources -v
chronyc tracking
chronyc -a makestep

echo_green "ufw set"
systemctl stop apparmor.service
systemctl disable apparmor.service
ufw disable
systemctl stop ufw.service
systemctl disable ufw.service

echo_green "modprobe set"
sudo modprobe ip_vs
sudo modprobe ip_vs_rr
sudo modprobe ip_vs_wrr
sudo modprobe ip_vs_sh
sudo modprobe br_netfilter
sudo modprobe nf_conntrack
lsmod | grep ip_vs
lsmod | grep ip_vs_rr
lsmod | grep ip_vs_wrr
lsmod | grep ip_vs_sh
lsmod | grep br_netfilter
lsmod | grep nf_conntrack
echo "ip_vs" | sudo tee -a /etc/modules
echo "ip_vs_rr" | sudo tee -a /etc/modules
echo "ip_vs_wrr" | sudo tee -a /etc/modules
echo "ip_vs_sh" | sudo tee -a /etc/modules
echo "br_netfilter" | sudo tee -a /etc/modules
echo "nf_conntrack" | sudo tee -a /etc/modules

sysctl -p

################################################################################
# Init Docker

echo_blue "Init Docker ..."

echo_green "doicker install"
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done 1>/dev/null

sudo apt-get install ca-certificates curl 1>/dev/null
sudo install -m 0755 -d /etc/apt/keyrings 1>/dev/null
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc 1>/dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc 1>/dev/null

# Add the repository to Apt sources:
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
		$(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get -q update

sudo apt-get -q -y install docker-ce=$DOCKER_VERSION docker-ce-cli=$DOCKER_VERSION containerd.io docker-buildx-plugin docker-compose-plugin

sudo apt-mark hold docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 1>/dev/null

echo_green "docker/daemon.json set"
grep -q 'default-ulimits' /etc/docker/daemon.json || cat >>/etc/docker/daemon.json <<EOF
{
  "default-ulimits": {
    "nofile": {
        "Name": "nofile",
        "Hard": 2097152,
        "Soft": 2097152
    },
    "nproc": {
      "Name": "nproc",
      "Hard": 2048,
      "Soft": 2048
    }
  },
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-file": "4",
    "max-size": "128m"
  },
  "dns": ["8.8.8.8", "8.8.4.4"],
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF

sudo systemctl enable docker --now 1>/dev/null
sudo systemctl restart docker 1>/dev/null

sudo groupadd docker 1>/dev/null
sudo usermod -aG docker "$USER" 1>/dev/null
