const { execSync } = require("child_process")

async function entryPoint() {
  try {
    execSync(`yarn build:$ETH_NETWORK && yarn graph deploy --ipfs $IPFS_URL $SUBGRAPH_NAME`)
  } catch(e) {
    console.log(e.stderr, e.stdout)
    return entryPoint()
  }
}

entryPoint()