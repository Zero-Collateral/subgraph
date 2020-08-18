import {
  TokenDeposited as TokenDepositedEvent,
  TokenWithdrawn as TokenWithdrawnEvent,
  PaymentLiquidated as PaymentLiquidatedEvent,
  TokenRepaid as TokenRepaidEvent,
  InterestWithdrawn as InterestWithdrawnEvent,
} from "../../../generated/USDC_ETH_LendingPool/USDCLendingPool";
import {
  LENDING_POOL_DEPOSITED,
  LENDING_POOL_WITHDRAWN,
  LENDING_POOL_REPAID,
  LENDING_POOL_LIQUIDATED,
  LENDING_POOL_INTEREST_WITHDRAWN,
  ETH_TX_TOKEN_DEPOSITED,
  ETH_TX_TOKEN_WITHDRAWN,
  ETH_TX_TOKEN_REPAID,
  ETH_TX_PAYMENT_LIQUIDATED,
  ETH_TX_INTEREST_WITHDRAWN,
  TOKEN_USDC,
  TTOKEN_TUSDC,
  COLLATERAL_TOKEN_ETH,
} from "../../utils/consts";
import { internalHandleLendingPoolChange } from "../../utils/lendingpool-commons";

export function handleInterestWithdrawn(event: InterestWithdrawnEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_INTEREST_WITHDRAWN,
    TTOKEN_TUSDC,
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_INTEREST_WITHDRAWN,
    event.params.lender,
    event.params.amount,
    event
  )
}

export function handleTokenDeposited(event: TokenDepositedEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_DEPOSITED,
    TTOKEN_TUSDC,
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_DEPOSITED,
    event.params.sender,
    event.params.amount,
    event
  )
}

export function handleTokenWithdrawn(event: TokenWithdrawnEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_WITHDRAWN,
    TTOKEN_TUSDC,
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_WITHDRAWN,
    event.params.sender,
    event.params.amount,
    event
  )
}

export function handleDaiRepaid(event: TokenRepaidEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_REPAID,
    TTOKEN_TUSDC,
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_REPAID,
    event.params.borrower,
    event.params.amount,
    event
  )
}

export function handlePaymentLiquidated(event: PaymentLiquidatedEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_PAYMENT_LIQUIDATED,
    TTOKEN_TUSDC,
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_LIQUIDATED,
    event.params.liquidator,
    event.params.amount,
    event
  )
}
