while sleep 10800; do node src/server/server.js && surge build && echo OK; done
