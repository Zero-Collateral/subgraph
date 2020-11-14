const { execSync } = require("child_process")

async function entryPoint() {
  try {
    execSync(`yarn build:$ETH_NETWORK && yarn graph deploy --node $GRAPH_NODE_URL --ipfs $IPFS_URL $SUBGRAPH_NAME`)
  } catch(e) {
    console.log(e)
    return entryPoint()
  }
}

entryPoint()