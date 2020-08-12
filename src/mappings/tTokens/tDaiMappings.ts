import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  MinterAdded as MinterAddedEvent,
  MinterRemoved as MinterRemovedEvent,
} from "../../../generated/TDAIToken/TToken";
import {
  createEthTransaction,
  buildId,
  createTTokenChange,
  updateTTokenBalancesFor,
} from "../../utils/commons";
import {
  ETH_TX_TTOKEN_APPROVAL,
  ETH_TX_TTOKEN_MINTER_ADDED,
  ETH_TX_TTOKEN_MINTER_REMOVED,
  TTOKEN_STATUS_TRANSFER,
  TTOKEN_STATUS_APPROVAL,
  TTOKEN_STATUS_MINTER_ADDED,
  TTOKEN_STATUS_MINTER_REMOVED,
  TTOKEN_TDAI,
  ETH_TX_TTOKEN_TRANSFER,
} from "../../utils/consts";

export function handleTransfer(event: TransferEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TTOKEN_TRANSFER);

  createTTokenChange(
    id,
    event.params.value,
    TTOKEN_TDAI,
    event.params.from,
    event.params.to,
    TTOKEN_STATUS_TRANSFER,
    ethTransaction
  )
  updateTTokenBalancesFor(TTOKEN_TDAI, event)
}

export function handleApproval(event: ApprovalEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TTOKEN_APPROVAL);
  createTTokenChange(
    id,
    event.params.value,
    TTOKEN_TDAI,
    event.params.owner,
    event.params.spender,
    TTOKEN_STATUS_APPROVAL,
    ethTransaction
  )
}

export function handleMinterAdded(event: MinterAddedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TTOKEN_MINTER_ADDED);
  createTTokenChange(
    id,
    BigInt.fromI32(0),
    TTOKEN_TDAI,
    event.params.account,
    event.params.account,
    TTOKEN_STATUS_MINTER_ADDED,
    ethTransaction
  )
}

export function handleMinterRemoved(event: MinterRemovedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TTOKEN_MINTER_REMOVED);
  createTTokenChange(
    id,
    BigInt.fromI32(0),
    TTOKEN_TDAI,
    event.params.account,
    event.params.account,
    TTOKEN_STATUS_MINTER_REMOVED,
    ethTransaction
  )
}
