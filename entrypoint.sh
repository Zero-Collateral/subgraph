#!/bin/sh
yarn
yarn build:$ETH_NETWORK
node entrypoint.js