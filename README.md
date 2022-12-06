# Simple Ryzen TDP

This is a very simple Linux TDP app that wraps ryzenadj

![screenshot](./simple-ryzen-tdp.png)

# Configure and usage

compile AppImage via `npm run package`, which will create the appimage file in the `dist` directory.

compile a ryzenadj binary, see [ryzenadj readme](https://github.com/FlyGoat/RyzenAdj#installation)

in terminal/console, run the `configure.sh` for to enable sudo-less access to the binary

e.g.
```bash
./configure.sh path_to_ryzenadj
```

then run the simple ryzen tdp appimage, and add the full filepath to ryzenadj binary in the appropriate text input.

The TDP slider should work after all configuration is complete