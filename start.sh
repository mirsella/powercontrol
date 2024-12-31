#!/bin/sh

path="$HOME/powercontrol"

cd "$path" || exit

sudo bash setup-hid-device.bash || exit

# git add -A
# git stash
# until ping 1.1.1.1 -c 1; do sleep 1; done

# if git pull | grep -q 'changed'; then
# 	echo "New commit, rebuilding and relaunching $0"
#
# 	(
# 		"$path"/server || exit
# 		npm i
# 		npm run build
# 	)
#
# 	sh "$0"
# else
cd "$path"/server || exit
npm run start
# fi
