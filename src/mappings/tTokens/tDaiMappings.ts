import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer as TransferEvent,
  Approval as ApprovalEvent,
  TToken,
} from "../../../generated/TDAIToken/TToken";
import {
  createEthTransaction,
  buildId,
  createTTokenHolderActionsChange,
  updateTTokenHolderBalancesFor,
  updateTTokenTotalSupplyFor,
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

  createTTokenHolderActionsChange(
    id,
    event.params.value,
    TTOKEN_TDAI,
    event.params.from,
    event.params.to,
    TTOKEN_STATUS_TRANSFER,
    ethTransaction
  );
  let tToken = TToken.bind(event.address);
  let tryBalanceOfFrom = tToken.try_balanceOf(event.params.from);
  let tryBalanceOfTo = tToken.try_balanceOf(event.params.to);

  let balanceOfFrom = tryBalanceOfFrom.reverted
    ? BigInt.fromI32(0)
    : tryBalanceOfFrom.value;
  let balanceOfTo = tryBalanceOfTo.reverted
    ? BigInt.fromI32(0)
    : tryBalanceOfTo.value;
  updateTTokenHolderBalancesFor(
    event.address,
    TTOKEN_TDAI,
    event.params.from,
    event.params.value,
    event.params.to,
    balanceOfFrom,
    balanceOfTo,
    event,
    ethTransaction
  );
  updateTTokenTotalSupplyFor(
    event.address,
    event.params.from,
    event.params.to,
    event.params.value,
    ethTransaction
  );
}

export function handleApproval(event: ApprovalEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TTOKEN_APPROVAL);
  createTTokenHolderActionsChange(
    id,
    event.params.value,
    TTOKEN_TDAI,
    event.params.owner,
    event.params.spender,
    TTOKEN_STATUS_APPROVAL,
    ethTransaction
  );
}
