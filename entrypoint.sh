#!/usr/bin/env sh
set -e


yarn prepare:$ETH_NETWORK
yarn codegen
yarn build:$ETH_NETWORK
node entrypoint.js