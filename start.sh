#!/bin/sh

cd "$(dirname "$0")" || exit

sudo bash setup-hid-claude.bash || exit

cd server || exit
npm run start
