#!/bin/sh

path="/home/pi/powercontrol"
log="/home/pi/powercontrol.log"

cd $path || exit
/home/pi/bin/waitfornetwork && git pull | rg 'changed'
new=$?
if [ "$new" -eq 0 ]; then
  echo "New commit, rebuilding..."

  cd $path/server || exit
  npm i
  npm run build

  cd $path/client || exit
  npm i
  npm run build
  sudo cp -r dist/* /var/www/html/powerclient
  sudo chmod -R 755 /var/www/html/powerclient
fi

cd $path/server || exit
npm run start > $log 2>&1
[ "$?" -ne 0 ] && /home/pi/bin/notif "powercontrol crashed $?"
