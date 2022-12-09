#!/bin/bash

# Verify root user.
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

smtOn() {
  /usr/bin/echo on > /sys/devices/system/cpu/smt/control
}

smtOff() {
  /usr/bin/echo off > /sys/devices/system/cpu/smt/control
}

if [[ $1 == "on" ]]; then
  smtOn
elif [[ $1 == "off" ]]; then
  smtOff
fi

