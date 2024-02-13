#!/bin/sh

path="$HOME/powercontrol"
log="$HOME/powercontrol.log"

cd $path || exit
git add -A
git stash
until ping 1.1.1.1 -c 1; do sleep 1; done
git pull | grep 'changed'
if [ $? -eq 0 ]; then
	echo "New commit, rebuilding..."

	cd $path/server || exit
	npm i
	npm run build

	#cd $path/client || exit
	#npm i
	#npm run build
	#sudo cp -r dist/* /var/www/html/powerclient
	#sudo chmod -R 755 /var/www/html/powerclient
fi

cd $path/server || exit
npm run start | awk "{print \"$(date) \" \$0}" 2>&1 | tee -a $log
