import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import {
  EthTransaction,
  PairAggregatorsChange,
  PairAggregatorsStatus,
} from "../../generated/schema";
import { getTimestampInMillis, createEthTransaction } from "./commons";
import {
  ETH_ADDRESS_STRING,
} from "./consts";
import { ERC20 } from "../../generated/ChainlinkPairAggregatorRegistry/ERC20";

export function createPairAggregatorsChange(
  creator: Address,
  baseToken: Address,
  baseTokenSymbol: string,
  quoteToken: Address,
  quoteTokenSymbol: string,
  pairAggregatorProxy: Address,
  responseDecimals: BigInt,
  collateralDecimals: BigInt,
  inverse: boolean,
  ethTransaction: EthTransaction,
  event: ethereum.Event
): PairAggregatorsChange {
  let id = ethTransaction.id;
  let entity = new PairAggregatorsChange(id);
  entity.transaction = ethTransaction.id;
  entity.creator = creator;
  entity.baseToken = baseToken;
  entity.baseTokenSymbol = baseTokenSymbol;
  entity.quoteToken = quoteToken;
  entity.quoteTokenSymbol = quoteTokenSymbol;
  entity.aggregator = pairAggregatorProxy;
  entity.responseDecimals = responseDecimals;
  entity.collateralDecimals = collateralDecimals;
  entity.inverse = inverse;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function updateOrCreatePairAggregatorsStatus(
  baseToken: Address,
  baseTokenSymbol: string,
  quoteToken: Address,
  quoteTokenSymbol: string,
  pairAggregatorProxy: Address,
  responseDecimals: BigInt,
  collateralDecimals: BigInt,
  inverse: boolean,
  event: ethereum.Event
): PairAggregatorsStatus {
  let id = baseToken.toHexString() + "_" + quoteToken.toHexString();
  let entity = PairAggregatorsStatus.load(id);
  if (entity == null) {
    entity = new PairAggregatorsStatus(id);
    entity.baseToken = baseToken;
    entity.quoteToken = quoteToken;
    entity.baseTokenSymbol = baseTokenSymbol;
    entity.quoteTokenSymbol = quoteTokenSymbol;
  }
  entity.aggregator = pairAggregatorProxy;
  entity.responseDecimals = responseDecimals;
  entity.collateralDecimals = collateralDecimals;
  entity.inverse = inverse;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity as PairAggregatorsStatus;
}

function getERC20Symbol(token: Address): string {
  if (token.toHexString() == ETH_ADDRESS_STRING) {
    return "ETH";
  }
  let baseTokenInstance = ERC20.bind(token);
  let tryBaseTokenSymbol = baseTokenInstance.try_symbol();
  return tryBaseTokenSymbol.reverted ? "-" : tryBaseTokenSymbol.value;
}

export function internalHandlePairAggregatorRegistered(
  creator: Address,
  baseToken: Address,
  quoteToken: Address,
  pairAggregatorProxy: Address,
  responseDecimals: BigInt,
  collateralDecimals: BigInt,
  inverse: boolean,
  event: ethereum.Event,
  action: string
): void {
  let ethTransaction = createEthTransaction(event, action);
  let baseTokenSymbol = getERC20Symbol(baseToken);
  let quoteTokenSymbol = getERC20Symbol(quoteToken);

  createPairAggregatorsChange(
    creator,
    baseToken,
    baseTokenSymbol,
    quoteToken,
    quoteTokenSymbol,
    pairAggregatorProxy,
    responseDecimals,
    collateralDecimals,
    inverse,
    ethTransaction,
    event
  );

  updateOrCreatePairAggregatorsStatus(
    baseToken,
    baseTokenSymbol,
    quoteToken,
    quoteTokenSymbol,
    pairAggregatorProxy,
    responseDecimals,
    collateralDecimals,
    inverse,
    event
  );
}
