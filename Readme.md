# RaspiMusic Server

## Prerequisites

static IP for the Raspberry Pi

browser (tested with [PaleMoon][1] browser)

[1]: http://linux.palemoon.org/

monitor or vnc connection for browser config

tested on Raspbian Buster

## Setup

clone the repository

run

```
npm install
```

build the [Client][2] app for production

[2]: https://github.com/neblancsi/RaspiMusicClient

copy the contents of the client dist folder in the public folder of the server

run

```
npm run dev
```

open http://[yourLocalStaticIP]:3000/#player and http://[yourLocalStaticIp]:3000 in two different tabs

play some music and enable autoplay of videos with music

set http://[yourLocalStaticIP]:3000/#player as starting page

then click Tools -> Preferences -> History -> choose 'never remember history'

if everything works, install pm2 globally, so the server can be started on startup

```
npm i -g pm2
```

run

```
cd src
pm2 start index.js
pm2 startup
pm2 save
```

last step is to configure the browser to run on startup with a few seconds of delay

one way to do it is setting up the execution of an executable sh file at startup

sample startScript:

```
#!/bin/bash
sleep 10
palemoon
```

make it executable

```
chmod +x <fileName>
```

run

```
cd /etc/xdg/lxsession/LXDE-[yourUsernameHere]
sudo nano autostart
```

change the content of the autostart file:

```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@lxterminal -e "/home/pi/projects/shell_scripts/startScript.sh"
@xscreensaver -no-splash
```

done!
