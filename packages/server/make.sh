#!/bin/bash

function build_server {
    yarn clean &&
    mkdir -p dist &&
    babel server -D -d dist --presets es2015,stage-2
}

function build_webapp {
    cd ../webapp &&
    yarn build &&
    cd -
}

function eb_zip {
    cp -R ../webapp/dist/prod/* ./dist/public/
    local APP_NAME='axon-app'
    local APP_VERSION=`git rev-parse --short HEAD`
    zip -x *.git* -x ".awcache/**" -x "node_modules/**" -x "aws-lambda/**" -x ".env" -r "../${APP_NAME}-${APP_VERSION}.zip" .
}

if [ "$#" -eq 0 ]; then
    server=1
    webapp=1
    eb_zip=1
fi

while [[ "$#" > 0 ]]; do case $1 in
  -s|--server) server=1;;
  -w|--webapp) webapp=1;;
  -z|--zip) eb_zip=1;;
  *) echo "Unknown parameter passed: $1"; exit 1;;
esac; shift; done


[[ -n $server ]] && build_server
[[ -n $webapp ]] && build_webapp
[[ -n $eb_zip ]] && eb_zip

echo Build complete.
