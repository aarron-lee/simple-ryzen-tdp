#!/bin/bash

# NOTE: script needs to be run twice, once with sudo, another without sudo
#
# usage:
#  sudo ./install.sh path_to_ryzenadj
#  e.g.
#     sudo ./install.sh /usr/local/bin/ryzenadj

FILE=$1

if test -f "$FILE"; then
    echo "$FILE exists."
else
    echo "$FILE doesn't exist"
    exit
fi

# Verify not root user.
if [ "$EUID" -ne 0 ]; then
	mkdir -p $HOME/Applications

	cd $HOME/Applications

	curl -L https://github.com/TheAssassin/AppImageLauncher/releases/download/v2.2.0/appimagelauncher-lite-2.2.0-travis995-0f91801-x86_64.AppImage > ./appimagelauncher-lite-2.2.0-travis995-0f91801-x86_64.AppImage

	chmod +x appimagelauncher-lite-2.2.0-travis995-0f91801-x86_64.AppImage

	echo "installing appimagelauncher lite"
	./appimagelauncher-lite-2.2.0-travis995-0f91801-x86_64.AppImage install

	curl -L https://github.com/aarron-lee/simple-ryzen-tdp/releases/download/v1.0.1/SimpleRyzenTDP-1.0.1.AppImage > ./SimpleRyzenTDP-1.0.1.AppImage

	echo "finished downloading tdp"
	chmod +x SimpleRyzenTDP-1.0.1.AppImage

	cd $HOME/.config

	echo "{ \"ryzenadjPath\": \"$FILE\" }" > ryzen-tdp-settings.json

	exit
fi

# else, is root user

if test -f "$FILE"; then
    echo "$FILE exists."

    # Set up the sudo permissions
    echo "Adding password free sudo access to ${FILE}:"
    
    cat <<-EOF > "/etc/sudoers.d/simple_ryzen_tdp_sudo"
${SUDO_USER} ALL=(ALL) NOPASSWD: $FILE*
EOF
else
    echo "$FILE doesn't exist"
fi
