#!/bin/sh
NODE_ENV=dev \
S0_DATA_PROVIDER_PORT=3000 \
S0_DATA_PROVIDER_PORT_DEBUGGER=4000 \
docker-compose up -V
#docker-compose down
