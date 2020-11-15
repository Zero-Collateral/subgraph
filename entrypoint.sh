#!/usr/bin/env sh
set -e

yarn prepare:$ETH_NETWORK
yarn codegen
yarn build:$ETH_NETWORK
yarn graph deploy --ipfs $IPFS_URL --node $NODE_URL $SUBGRAPH_NAME