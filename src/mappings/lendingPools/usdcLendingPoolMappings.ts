import {
  TokenDeposited as TokenDepositedEvent,
  TokenWithdrawn as TokenWithdrawnEvent,
  PaymentLiquidated as PaymentLiquidatedEvent,
  TokenRepaid as TokenRepaidEvent,
} from "../../../generated/LendingPoolInterface/LendingPoolInterface";
import {
  createLendingPoolStatus,
  createEthTransaction,
  buildId,
} from "../../utils/commons";
import {
  LENDING_POOL_DEPOSIT,
  LENDING_POOL_WITHDRAW,
  LENDING_POOL_REPAY,
  LENDING_POOL_LIQUIDATE,
  ETH_TX_TOKEN_DEPOSITED,
  ETH_TX_TOKEN_WITHDRAWN,
  ETH_TX_TOKEN_REPAID,
  ETH_TX_PAYMENT_LIQUIDATED,
  TOKEN_USDC,
  ZTOKEN_ZUSDC,
} from "../../utils/consts";

export function handleTokenDeposited(event: TokenDepositedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TOKEN_DEPOSITED);
  createLendingPoolStatus(
    id,
    ZTOKEN_ZUSDC,
    TOKEN_USDC,
    LENDING_POOL_DEPOSIT,
    event.params.sender,
    event.params.amount,
    ethTransaction
  );
}

export function handleTokenWithdrawn(event: TokenWithdrawnEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TOKEN_WITHDRAWN);
  createLendingPoolStatus(
    id,
    ZTOKEN_ZUSDC,
    TOKEN_USDC,
    LENDING_POOL_WITHDRAW,
    event.params.sender,
    event.params.amount,
    ethTransaction
  );
}

export function handleDaiRepaid(event: TokenRepaidEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_TOKEN_REPAID);
  createLendingPoolStatus(
    id,
    ZTOKEN_ZUSDC,
    TOKEN_USDC,
    LENDING_POOL_REPAY,
    event.params.borrower,
    event.params.amount,
    ethTransaction
  );
}

export function handlePaymentLiquidated(event: PaymentLiquidatedEvent): void {
  let id = buildId(event);
  let ethTransaction = createEthTransaction(event, ETH_TX_PAYMENT_LIQUIDATED);
  createLendingPoolStatus(
    id,
    ZTOKEN_ZUSDC,
    TOKEN_USDC,
    LENDING_POOL_LIQUIDATE,
    event.params.liquidator,
    event.params.amount,
    ethTransaction
  );
}
