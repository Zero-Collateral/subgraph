const { execSync } = require("child_process")

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function freeze() {
  await delay(100000)
  return await freeze()
}

async function entryPoint() {
  await delay(60000)

  try {
    console.log("Trying to deploy")
    execSync(`yarn graph deploy --ipfs $IPFS_URL --node $NODE_URL $SUBGRAPH_NAME`)
  } catch(e) {
    console.log(e.stderr.toString(), e.stdout.toString())
    return await entryPoint()
  }

  return await freeze()
}

entryPoint()