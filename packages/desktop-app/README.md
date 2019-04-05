# desktop app

hi

## notes

When running the Mac .pkg installer, sometimes it won't install anything.  You have to run `sudo pkgutil --forget <package id>` and delete the Axon.app file in the build folder or OSX will simply install on top of it (instead of into /Applications).  See: https://stackoverflow.com/questions/19283889/osx-pkg-installer-sometimes-does-not-install-app-file#19537586

The Mac `icon.icns` file isn't working (it thinks it's empty for some reason), and the `icon.ico` file is too small.  Right now we're using `icon.png` as it

Despite it being present in the package.json `build` config, it's still necessary to add the `--c.mac.appId=com.axon.app` flag to the electron-build command for OSX.  Otherwise, it complains that it can't find Electron.framework.


## Windows

1. Use MSYS2
2. Install nodejs with pacman: `pacman -S mingw-w64-x86_64-nodejs`
2. Tell npm which Python to use (must be 2.7, installed via `npm i -g windows-build-tools`, or else it'll parse paths incorrectly)

```sh
npm config set python C:\Users\<your username>\.windows-build-tools\python27\python.exe
```

(or if that doesn't work, just directly edit the `~/.npmrc` file and add that path)

3. yarn
4. yarn build
5. yarn electron-build-win

