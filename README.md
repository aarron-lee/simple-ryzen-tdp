# Simple Ryzen TDP

This is a very simple Linux TDP app that wraps ryzenadj

![screenshot](./simple-ryzen-tdp.png)

# Configure and usage

Download AppImage from releases, or compile AppImage via `npm run package`, which will create the appimage file in the `dist` directory.

- note, AppImage will require installing fuse2 on linux distros that only have fuse3

compile a ryzenadj binary, see [ryzenadj readme](https://github.com/FlyGoat/RyzenAdj#installation). You could also try downloading a ryzenadj binary (e.g. [here](https://github.com/ShadowBlip/HandyPT/blob/af496071600d44f24bf36cdc087c18fc1b1865da/bin/ryzenadj)), but I take no responsibility for whether it works or not.

in terminal/console, download + run the [configure.sh](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/configure.sh) script for to enable password-less sudo access to the ryzenadj binary

e.g.
```bash
sudo ./configure.sh path_to_ryzenadj_binary
# e.g.
sudo ./configure.sh /home/username/applications
```

then run the simple ryzen tdp appimage, and add the full filepath to ryzenadj binary in the appropriate text input.

The TDP slider should work after all configuration is complete

There is also a generic install script, usage as follows:

```bash
# must be run twice, once with sudo, once without sudo

chmod +x install.sh

sudo ./install.sh /path/to/ryzenadj/file
./install.sh /path/to/ryzenadj/file
```


# ChimeraOS install script

There is an install script for ChimeraOS 38 or higher, found [here](https://github.com/aarron-lee/simple-ryzen-tdp/blob/main/chimeraos_install.sh)

make it executable with either `chmod +x` or in the script file's properties.

then run it twice, once with sudo, once without sudo.

e.g.

```bash
# in terminal/console

chmod +x /home/gamer/Downloads/chimeraos_install.sh
sudo /home/gamer/Downloads/chimeraos_install.sh 
/home/gamer/Downloads/chimeraos_install.sh 
``` 

# Disclaimer

This software is provided "as is", I built this app solely for personal use only. In no event shall I be liable for any direct, indirect, incidental, special, or consequential damages. I have no intention of supporting this app beyond maintenance fixes, although PRs are welcome
