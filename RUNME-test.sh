#!/bin/sh
SERVICE=all \
DEBUGGER_PORT=9229 \
docker-compose --file docker-compose.test.yml up --abort-on-container-exit --renew-anon-volumes
# docker-compose --file docker-compose.test.yml down
