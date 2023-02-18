# Simple Ryzen TDP

This is a very simple Linux TDP app that wraps ryzenadj

## App Window

![screenshot](https://user-images.githubusercontent.com/9145965/207160968-9ac6d4b8-cb00-4d81-9223-a712650e49cb.png)

## Tray Icon

![screenshot](https://user-images.githubusercontent.com/9145965/218102072-657bca4f-cf9d-456c-a804-34523548de43.png)

# Installation

There is a generic install script, found [here](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/install.sh), which installs [appimagelauncher-lite](https://github.com/TheAssassin/AppImageLauncher) and the tdp app

The script assumes you already have ryzenadj installed. If not, you will need to compile a ryzenadj binary, see [ryzenadj readme](https://github.com/FlyGoat/RyzenAdj#installation). You could also try downloading a ryzenadj binary (e.g. [here](https://github.com/ShadowBlip/HandyPT/blob/af496071600d44f24bf36cdc087c18fc1b1865da/bin/ryzenadj)), but I take no responsibility for whether it works or not.

Note, for 6800u chipsets, you may need to add `iomem=relaxed` as a boot parameter for ryzenadj to work, see github issue [here](https://github.com/FlyGoat/RyzenAdj/issues/210) for discussion.

usage as follows:

```bash
# must be run twice, once with sudo, once without sudo

chmod +x install.sh
sudo ./install.sh /path/to/ryzenadj/file
./install.sh /path/to/ryzenadj/file

# example where ryzenadj is located at /usr/bin/ryzenadj
chmod +x install.sh
sudo ./install.sh /usr/bin/ryzenadj
./install.sh /usr/bin/ryzenadj
```

# ChimeraOS install script

There is an install script for ChimeraOS 38 or higher, found [here](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/chimeraos_install.sh)

make it executable with either `chmod +x` or in the script file's properties. Then run it twice, once with sudo, once without sudo. default sudo pass is `gamer`

You still need to add it manually to Steam as a non-steam game.

e.g.

```bash
# in terminal/console

chmod +x /home/gamer/Downloads/chimeraos_install.sh
sudo /home/gamer/Downloads/chimeraos_install.sh
/home/gamer/Downloads/chimeraos_install.sh
```

# Configuring Ryzenadj

If you used the `install.sh` or `chimeraos_install.sh` with sudo, passwordless sudo for ryzenadj should already be configured and working for you.

otherwise, in terminal/console, download + run the [configure.sh](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/configure.sh) script for to enable password-less sudo access to the ryzenadj binary

e.g.

```bash
sudo ./configure.sh path_to_ryzenadj_binary
# e.g.
sudo ./configure.sh /home/username/applications
```

once complete, you should be able to run `sudo ryzenadj -i` in a new terminal window without being prompted for a password.

# Manual Build

Compile AppImage via `npm run package`, which will create the appimage file in the `dist` directory.

- note, AppImage will require installing fuse2 on linux distros that only have fuse3

compile a ryzenadj binary, see [ryzenadj readme](https://github.com/FlyGoat/RyzenAdj#installation). You could also try downloading a ryzenadj binary (e.g. [here](https://github.com/ShadowBlip/HandyPT/blob/af496071600d44f24bf36cdc087c18fc1b1865da/bin/ryzenadj)), but I take no responsibility for whether it works or not.

Note, for 6800u chipsets, you may need to add `iomem=relaxed` as a boot parameter for ryzenadj to work, see github issue [here](https://github.com/FlyGoat/RyzenAdj/issues/210) for discussion.

in terminal/console, download + run the [configure.sh](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/configure.sh) script for to enable password-less sudo access to the ryzenadj binary

e.g.

```bash
sudo ./configure.sh path_to_ryzenadj_binary
# e.g.
sudo ./configure.sh /home/username/applications
```

then run the simple ryzen tdp appimage, and add the full filepath to ryzenadj binary in the appropriate text input.

The TDP slider should work after all configuration is complete

# Disclaimer

This software is provided "as is", I built this app solely for personal use only. In no event shall I be liable for any direct, indirect, incidental, special, or consequential damages. I have no intention of supporting this app beyond maintenance fixes, although PRs are welcome
