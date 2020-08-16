// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class InterestValidatorUpdated extends ethereum.Event {
  get params(): InterestValidatorUpdated__Params {
    return new InterestValidatorUpdated__Params(this);
  }
}

export class InterestValidatorUpdated__Params {
  _event: InterestValidatorUpdated;

  constructor(event: InterestValidatorUpdated) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oldInterestValidator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newInterestValidator(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class InterestWithdrawn extends ethereum.Event {
  get params(): InterestWithdrawn__Params {
    return new InterestWithdrawn__Params(this);
  }
}

export class InterestWithdrawn__Params {
  _event: InterestWithdrawn;

  constructor(event: InterestWithdrawn) {
    this._event = event;
  }

  get lender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class PaymentLiquidated extends ethereum.Event {
  get params(): PaymentLiquidated__Params {
    return new PaymentLiquidated__Params(this);
  }
}

export class PaymentLiquidated__Params {
  _event: PaymentLiquidated;

  constructor(event: PaymentLiquidated) {
    this._event = event;
  }

  get liquidator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TokenDeposited extends ethereum.Event {
  get params(): TokenDeposited__Params {
    return new TokenDeposited__Params(this);
  }
}

export class TokenDeposited__Params {
  _event: TokenDeposited;

  constructor(event: TokenDeposited) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TokenRepaid extends ethereum.Event {
  get params(): TokenRepaid__Params {
    return new TokenRepaid__Params(this);
  }
}

export class TokenRepaid__Params {
  _event: TokenRepaid;

  constructor(event: TokenRepaid) {
    this._event = event;
  }

  get borrower(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TokenWithdrawn extends ethereum.Event {
  get params(): TokenWithdrawn__Params {
    return new TokenWithdrawn__Params(this);
  }
}

export class TokenWithdrawn__Params {
  _event: TokenWithdrawn;

  constructor(event: TokenWithdrawn) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class USDCLendingPool extends ethereum.SmartContract {
  static bind(address: Address): USDCLendingPool {
    return new USDCLendingPool("USDCLendingPool", address);
  }

  lendingToken(): Address {
    let result = super.call("lendingToken", "lendingToken():(address)", []);

    return result[0].toAddress();
  }

  try_lendingToken(): ethereum.CallResult<Address> {
    let result = super.tryCall("lendingToken", "lendingToken():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  interestValidator(): Address {
    let result = super.call(
      "interestValidator",
      "interestValidator():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_interestValidator(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "interestValidator",
      "interestValidator():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class RepayCall extends ethereum.Call {
  get inputs(): RepayCall__Inputs {
    return new RepayCall__Inputs(this);
  }

  get outputs(): RepayCall__Outputs {
    return new RepayCall__Outputs(this);
  }
}

export class RepayCall__Inputs {
  _call: RepayCall;

  constructor(call: RepayCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get borrower(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RepayCall__Outputs {
  _call: RepayCall;

  constructor(call: RepayCall) {
    this._call = call;
  }
}

export class LiquidationPaymentCall extends ethereum.Call {
  get inputs(): LiquidationPaymentCall__Inputs {
    return new LiquidationPaymentCall__Inputs(this);
  }

  get outputs(): LiquidationPaymentCall__Outputs {
    return new LiquidationPaymentCall__Outputs(this);
  }
}

export class LiquidationPaymentCall__Inputs {
  _call: LiquidationPaymentCall;

  constructor(call: LiquidationPaymentCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get liquidator(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class LiquidationPaymentCall__Outputs {
  _call: LiquidationPaymentCall;

  constructor(call: LiquidationPaymentCall) {
    this._call = call;
  }
}

export class CreateLoanCall extends ethereum.Call {
  get inputs(): CreateLoanCall__Inputs {
    return new CreateLoanCall__Inputs(this);
  }

  get outputs(): CreateLoanCall__Outputs {
    return new CreateLoanCall__Outputs(this);
  }
}

export class CreateLoanCall__Inputs {
  _call: CreateLoanCall;

  constructor(call: CreateLoanCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get borrower(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class CreateLoanCall__Outputs {
  _call: CreateLoanCall;

  constructor(call: CreateLoanCall) {
    this._call = call;
  }
}

export class WithdrawInterestCall extends ethereum.Call {
  get inputs(): WithdrawInterestCall__Inputs {
    return new WithdrawInterestCall__Inputs(this);
  }

  get outputs(): WithdrawInterestCall__Outputs {
    return new WithdrawInterestCall__Outputs(this);
  }
}

export class WithdrawInterestCall__Inputs {
  _call: WithdrawInterestCall;

  constructor(call: WithdrawInterestCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawInterestCall__Outputs {
  _call: WithdrawInterestCall;

  constructor(call: WithdrawInterestCall) {
    this._call = call;
  }
}

export class SetInterestValidatorCall extends ethereum.Call {
  get inputs(): SetInterestValidatorCall__Inputs {
    return new SetInterestValidatorCall__Inputs(this);
  }

  get outputs(): SetInterestValidatorCall__Outputs {
    return new SetInterestValidatorCall__Outputs(this);
  }
}

export class SetInterestValidatorCall__Inputs {
  _call: SetInterestValidatorCall;

  constructor(call: SetInterestValidatorCall) {
    this._call = call;
  }

  get newInterestValidator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetInterestValidatorCall__Outputs {
  _call: SetInterestValidatorCall;

  constructor(call: SetInterestValidatorCall) {
    this._call = call;
  }
}
