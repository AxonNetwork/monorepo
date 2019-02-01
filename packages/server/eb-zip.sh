set -e
export APP_NAME='conscience-api'
export APP_VERSION=`git rev-parse --short HEAD`

npm run build
zip -x *.git* -x "node_modules/**" -x ".env" -r "../${APP_NAME}-${APP_VERSION}.zip" .
