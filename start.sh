#!/bin/sh

path="/home/pi/powercontrol"
log="/home/pi/powercontrol.log"

cd $path
waitfornetwork && git pull | rg 'changed'
new=$?
if [ "$new" -eq 0 ]; then
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
[ "$?" -ne 0 ] && notif "powercontrol crashed $?"
