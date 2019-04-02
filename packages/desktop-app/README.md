# desktop app

hi

## notes

When running the Mac .pkg installer, sometimes it won't install anything.  You have to run `sudo pkgutil --forget <package id>` and delete the Axon.app file in the build folder or OSX will simply install on top of it (instead of into /Applications).  See: https://stackoverflow.com/questions/19283889/osx-pkg-installer-sometimes-does-not-install-app-file#19537586

The Mac `icon.icns` file isn't working (it thinks it's empty for some reason), and the `icon.ico` file is too small.  Right now we're using `icon.png` as it

Despite it being present in the package.json `build` config, it's still necessary to add the `--c.mac.appId=com.axon.app` flag to the electron-build command for OSX.  Otherwise, it complains that it can't find Electron.framework.

