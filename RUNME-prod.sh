#!/bin/sh
NODE_ENV=prod \
S0_DATA_PROVIDER_PORT=3000 \
S0_DATA_PROVIDER_PORT_DEBUGGER=4000 \
S2_METRICS_PROVIDER_PORT=3002 \
S2_METRICS_PROVIDER_PORT_DEBUGGER=4002 \
docker-compose up --renew-anon-volumes
# docker-compose up --renew-anon-volumes --no-start
# docker-compose down
