#!/usr/bin/env sh
set -e

yarn prepare:$ETH_NETWORK
yarn codegen

if yarn graph create --node $NODE_URL $SUBGRAPH_NAME; then
  yarn graph deploy --ipfs $IPFS_URL --node $NODE_URL $SUBGRAPH_NAME
else
  yarn graph deploy --ipfs $IPFS_URL --node $NODE_URL $SUBGRAPH_NAME
fi

# Temporarily freezing this container
while [ true ]
do
  sleep 3600
done