import {
  PairAggregatorRegistered as PairAggregatorRegisteredEvent,
  PairAggregatorUpdated as PairAggregatorUpdatedEvent,
} from "../../generated/ChainlinkPairAggregatorRegistry/ChainlinkPairAggregatorRegistry";

import { internalHandlePairAggregatorRegistered } from "../utils/pair-aggregator-registry-common";
import { ETH_TX_PAIR_AGGREGATOR_REGISTERED, ETH_TX_PAIR_AGGREGATOR_UPDATED } from "../utils/consts";
import { BigInt } from "@graphprotocol/graph-ts";

export function handlePairAggregatorRegistered(
  event: PairAggregatorRegisteredEvent
): void {
  internalHandlePairAggregatorRegistered(
    event.params.sender,
    event.params.baseToken,
    event.params.quoteToken,
    event.params.pairAggregator,
    BigInt.fromI32(event.params.responseDecimals),
    BigInt.fromI32(event.params.collateralDecimals),
    event.params.inverse,
    event,
    ETH_TX_PAIR_AGGREGATOR_REGISTERED,
  );
}

export function handlePairAggregatorUpdated(
  event: PairAggregatorUpdatedEvent
): void {
  internalHandlePairAggregatorRegistered(
    event.params.sender,
    event.params.baseToken,
    event.params.quoteToken,
    event.params.newPairAggregator,
    BigInt.fromI32(event.params.newResponseDecimals),
    BigInt.fromI32(event.params.newCollateralDecimals),
    event.params.newInverse,
    event,
    ETH_TX_PAIR_AGGREGATOR_UPDATED,
  );
}
