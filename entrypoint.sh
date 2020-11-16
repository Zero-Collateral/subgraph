#!/usr/bin/env sh
set -e

yarn prepare:$ETH_NETWORK
yarn codegen
yarn graph create --node $NODE_URL $SUBGRAPH_NAME && \
  yarn graph deploy --ipfs $IPFS_URL --node $NODE_URL $SUBGRAPH_NAME

# Temporarily freezing this container
while [ true ]
do
  sleep 3600
done