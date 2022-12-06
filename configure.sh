#!/bin/bash

# Verify root user.
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

if [ "$1" == "" ]
  then echo "Please provide path to ryzenadj"
  exit
fi

FILE=$1/ryzenadj

if test -f "$FILE"; then
    echo "$FILE exists."

    # Set up the sudo permissions
    echo "Adding password free sudo access to ryzenadj for user ${SUDO_USER}:"
    echo $1/ryzenadj
    cat <<-EOF > "/etc/sudoers.d/simple_ryzen_tdp_sudo"
    ${SUDO_USER} ALL=(ALL) NOPASSWD: $FILE*
    EOF
else
    echo "$FILE doesn't exist"
fi

