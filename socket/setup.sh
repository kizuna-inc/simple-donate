#!/bin/sh

printenv

echo 'const config = {server: "'$server'", room: "'$room_name'"};' > /usr/share/nginx/html/src/js/config.js
# sleep infinity
# tail -f /dev/null
# nginx

killall nginx
exec nginx -g "daemon off;"
