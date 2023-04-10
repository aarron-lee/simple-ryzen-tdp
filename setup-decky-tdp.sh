#!/bin/bash

# Verify root user.
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd /home/gamer/Downloads

# enable pstate and iomem=relaxed

curl -OL https://raw.githubusercontent.com/ruineka/chimeraos-hack-tools/main/hacks/chimeraos-enable-amdpstate.sh

chmod +x ./chimeraos-enable-amdpstate.sh

./chimeraos-enable-amdpstate.sh

rm ./chimeraos-enable-amdpstate.sh

# install decky loader

curl -L https://github.com/SteamDeckHomebrew/decky-installer/releases/latest/download/install_release.sh | sh

# setup decky TDP plugin

curl -OL https://github.com/aarron-lee/simple-ryzen-tdp/files/11186329/PowerControl.tar.gz

tar -xvzf ./PowerControl.tar.gz -C /home/gamer/homebrew/plugins/

echo "done, reboot for your changes to take effect"
