import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  MinterAdded as MinterAddedEvent,
  MinterRemoved as MinterRemovedEvent,
} from "../../../generated/ZToken/ZToken";
import {
  createEthTransaction,
  buildId,
  createZTokenStatus,
  updateZTokenBalancesFor,
} from "../../utils/commons";
import {
  ETH_TX_TOKEN_DEPOSITED,
  ETH_TX_ZTOKEN_APPROVAL,
  ETH_TX_ZTOKEN_MINTER_ADDED,
  ETH_TX_ZTOKEN_MINTER_REMOVED,
  ZTOKEN_STATUS_TRANSFER,
  ZTOKEN_STATUS_APPROVAL,
  ZTOKEN_STATUS_MINTER_ADDED,
  ZTOKEN_STATUS_MINTER_REMOVED,
  ZTOKEN_ZDAI,
  ZTOKEN_ZUSDC,
} from "../../utils/consts";

export function handleTransfer(event: TransferEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TOKEN_DEPOSITED);

  createZTokenStatus(
    id,
    event.params.value,
    ZTOKEN_ZUSDC,
    event.params.from,
    event.params.to,
    ZTOKEN_STATUS_TRANSFER,
    ethTransaction
  )
  updateZTokenBalancesFor(ZTOKEN_ZUSDC, event)
}

export function handleApproval(event: ApprovalEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_ZTOKEN_APPROVAL);
  createZTokenStatus(
    id,
    event.params.value,
    ZTOKEN_ZUSDC,
    event.params.owner,
    event.params.spender,
    ZTOKEN_STATUS_APPROVAL,
    ethTransaction
  )
}

export function handleMinterAdded(event: MinterAddedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_ZTOKEN_MINTER_ADDED);
  createZTokenStatus(
    id,
    BigInt.fromI32(0),
    ZTOKEN_ZUSDC,
    event.params.account,
    event.params.account,
    ZTOKEN_STATUS_MINTER_ADDED,
    ethTransaction
  )
}

export function handleMinterRemoved(event: MinterRemovedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_ZTOKEN_MINTER_REMOVED);
  createZTokenStatus(
    id,
    BigInt.fromI32(0),
    ZTOKEN_ZUSDC,
    event.params.account,
    event.params.account,
    ZTOKEN_STATUS_MINTER_REMOVED,
    ethTransaction
  )
}
