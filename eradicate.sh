#!/bin/sh

sudo rm -rf /Applications/Conscience.app
sudo pkgutil --forget com.conscience.app
rm -rf ./desktop/dist-*
rm /tmp/conscience-*
rm /usr/local/bin/conscience*
rm /usr/local/bin/git-remote-conscience

