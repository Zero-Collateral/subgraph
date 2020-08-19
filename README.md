# Teller Protocol Subgraph

This is the official Subgraph for the Teller Protocol [smart contracts](https://github.com/teller-protocol/teller-protocol-v1).

## Resources

Website → https://teller.finance/
Twitter → https://twitter.com/useteller 
Blog → https://medium.com/fabrx-blockchain
Discord → https://discord.gg/z3AJ9F

## Get Started

To get started, you need to install the dependencies:

- Using Yarn: ```yarn install```
- Using NPM: ```npm install```

## Network Configuration

This subgraph uses a configuration file to inject variables into a template file (see ```subgraph.template.yaml```), and create the final ```subgraph.yaml```.

The final **subgraph.yaml** file is used to deploy on the network.

### Configuration

Each network has a JSON file in the `./config` folder. When a deploy process is executed (using a script defined in the `package.json`), it creates the final subgraph.yaml, and then deploy it to the The Graph node.

### Scripts

At this moment, the scripts available are:

- **yarn deploy:ganache**: build the subgraph.yaml file, and deploy it on a Ganache (local) instance.
- **yarn deploy:ropsten**: build the subgraph.yaml file, and deploy it on a Ganache (local) instance.

## Subgraphs

Currently, you can play with our subgraph here:

- [Mainnet](https://thegraph.com/explorer/subgraph/teller-protocol/subgraph-mainnet).

---
© Copyright 2020, Fabrx Labs
