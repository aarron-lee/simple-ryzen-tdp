# Simple Ryzen TDP

This is a very simple Linux TDP app that wraps ryzenadj

## App Window

![screenshot](https://github-production-user-asset-6210df.s3.amazonaws.com/9145965/281605251-ba704369-3d01-4166-90b0-d86f66ad83f2.png)

## Tray Icon

![screenshot](https://user-images.githubusercontent.com/9145965/218102072-657bca4f-cf9d-456c-a804-34523548de43.png)

## Requirements

### WARNING: This app assumes you already have ryzenadj installed and working

ChimeraOS, Bazzite Deck Edition, and NobaraOS Deck edition, should already have ryzenadj pre-installed.

This app assumes you already have ryzenadj installed. If not, you will need to compile a ryzenadj binary, see [ryzenadj readme](https://github.com/FlyGoat/RyzenAdj#installation).

To check this, you can run `which ryzenadj` in a terminal/console, which should print out the path to a ryzenadj binary.

e.g.

```
$ which ryzenadj
/usr/bin/ryzenadj
```

If you do not have ryzenadj installed, you will need to get a working copy installed onto your machine.

To test your ryzenadj to make sure that it's functional, run the following:

```
$ sudo ryzenadj -i
```

This should print out a table that looks something like the following:

```
CPU Family: Rembrandt
SMU BIOS Interface Version: 18
Version: v0.13.0
PM Table Version: 450005
|        Name         |   Value   |     Parameter      |
|---------------------|-----------|--------------------|
| STAPM LIMIT         |     8.000 | stapm-limit        |
| STAPM VALUE         |     0.062 |                    |
```

If you see an error, you may need to set `iomem=relaxed` as a boot parameter for your kernel, or disable secure boot.

# Recommended Installation Method

Download the latest AppImage from releases,and use an AppImage installer such as [Gear Lever](https://flathub.org/apps/it.mijorus.gearlever) to install the AppImage.

Afterwards, configure ryzenadj to be usable with the app (see [configure script](#configuring-ryzenadj)).

# ChimeraOS install script

Setup video guide can be found on youtube [here](https://www.youtube.com/watch?v=N7C0kYVXoxk)

Note, this install script installs [appimagelauncher-lite](https://github.com/TheAssassin/AppImageLauncher) alongside the tdp app

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

Note, for newer Ryzen chipsets, you may need to add `iomem=relaxed` as a boot parameter for ryzenadj to work, see github issue [here](https://github.com/FlyGoat/RyzenAdj/issues/210) for discussion.

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
