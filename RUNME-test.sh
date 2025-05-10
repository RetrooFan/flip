#!/bin/sh
SERVICE=all \
DEBUGGER_PORT=9229 \
docker-compose -f docker-compose.test.yml up --abort-on-container-exit -V
#docker-compose -f docker-compose.test.yml down
