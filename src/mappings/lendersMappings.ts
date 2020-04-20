import { log } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  AccruedInterestUpdated as AccruedInterestUpdatedEvent,
  AccruedInterestWithdrawn as AccruedInterestWithdrawnEvent,
  InterestUpdateRequested as InterestUpdateRequestedEvent,
  CancelInterestUpdate as CancelInterestUpdateEvent,
} from "../../generated/LendersInterface/LendersInterface";
import {
  AccruedInterestStatus,
  InterestUpdateStatus,
} from "../../generated/schema";
import { createEthTransaction, buildId } from "../utils/commons";
import {
  ACCRUED_INTEREST_STATUS_UPDATED,
  ETH_TX_ACCRUED_INTEREST_UPDATED,
  ACCRUED_INTEREST_STATUS_WITHDRAWN,
  ETH_TX_ACCRUED_INTEREST_WITHDRAWN,
  ETH_TX_INTEREST_UPDATE_REQUESTED,
  INTEREST_UPDATE_REQUESTED,
  ETH_TX_INTEREST_UPDATE_CANCELED,
  INTEREST_UPDATE_CANCELED,
} from "../utils/consts";

export function handleAccruedInterestUpdated(
  event: AccruedInterestUpdatedEvent
): void {
  let id = buildId(event);
  log.info("Creating new accrued interest status (UPDATED) with id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_ACCRUED_INTEREST_UPDATED
  );
  let entity = new AccruedInterestStatus(id);
  entity.transaction = ethTransaction.id;
  entity.lender = event.params.lender;
  entity.totalAmount = event.params.totalNotWithdrawn;
  entity.accruedInterest = event.params.totalAccruedInterest;
  entity.action = ACCRUED_INTEREST_STATUS_UPDATED;
  entity.save();
}

export function handleAccruedInterestWithdrawn(
  event: AccruedInterestWithdrawnEvent
): void {
  let id = buildId(event);
  log.info("Creating new interest accepted with (WITHDRAWN) id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_ACCRUED_INTEREST_WITHDRAWN
  );
  let entity = new AccruedInterestStatus(id);
  entity.transaction = ethTransaction.id;
  entity.lender = event.params.recipient;
  entity.totalAmount = event.params.amount; // TODO Verify it
  entity.accruedInterest = BigInt.fromI32(0);
  entity.action = ACCRUED_INTEREST_STATUS_WITHDRAWN;
  entity.save();
}

export function handleInterestUpdateRequested(
  event: InterestUpdateRequestedEvent
): void {
  let id = buildId(event);
  log.info("Creating new interest update status with (REQUESTED) id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_INTEREST_UPDATE_REQUESTED
  );
  let entity = new InterestUpdateStatus(id);
  entity.transaction = ethTransaction.id;
  entity.lender = event.params.lender;
  entity.blockNumber = event.params.blockNumber;
  entity.updatedAt = event.block.timestamp.times(BigInt.fromI32(1000));
  entity.action = INTEREST_UPDATE_REQUESTED;
  entity.save();
}

export function handleCancelInterestUpdate(
  event: CancelInterestUpdateEvent
): void {
  let id = buildId(event);
  log.info("Creating new interest update with (CANCELED) id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_INTEREST_UPDATE_CANCELED
  );
  let entity = new InterestUpdateStatus(id);
  entity.transaction = ethTransaction.id;
  entity.lender = event.params.lender;
  entity.blockNumber = event.params.blockNumber;
  entity.updatedAt = event.block.timestamp.times(BigInt.fromI32(1000));
  entity.action = INTEREST_UPDATE_CANCELED;
  entity.save();
}
