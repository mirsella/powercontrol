#!/bin/sh

path="/home/pi/powercontrol"
log="/home/pi/powercontrol.log"

cd $path
new=(git pull | rg 'changed')
if [ "$new" -eq 1 ]; then
  echo "New commit, rebuilding..."

  cd $path/server
  npm run build

  cd $path/client
  npm run build
  sudo cp -r dist/* /var/www/html/powerclient
  sudo chmod -R 755 /var/www/html/powerclient
fi

cd $path/server
npm run start > $log 2>&1
