"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = "gravity.v1";
const baseBridgeValidator = {
  power: long_1.default.UZERO,
  ethereumAddress: "",
};
exports.BridgeValidator = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (!message.power.isZero()) {
      writer.uint32(8).uint64(message.power);
    }
    if (message.ethereumAddress !== "") {
      writer.uint32(18).string(message.ethereumAddress);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : new minimal_1.default.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.assign({}, baseBridgeValidator);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.power = reader.uint64();
          break;
        case 2:
          message.ethereumAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    const message = Object.assign({}, baseBridgeValidator);
    if (object.power !== undefined && object.power !== null) {
      message.power = long_1.default.fromString(object.power);
    } else {
      message.power = long_1.default.UZERO;
    }
    if (
      object.ethereumAddress !== undefined &&
      object.ethereumAddress !== null
    ) {
      message.ethereumAddress = String(object.ethereumAddress);
    } else {
      message.ethereumAddress = "";
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    message.power !== undefined &&
      (obj.power = (message.power || long_1.default.UZERO).toString());
    message.ethereumAddress !== undefined &&
      (obj.ethereumAddress = message.ethereumAddress);
    return obj;
  },
  fromPartial(object) {
    const message = Object.assign({}, baseBridgeValidator);
    if (object.power !== undefined && object.power !== null) {
      message.power = object.power;
    } else {
      message.power = long_1.default.UZERO;
    }
    if (
      object.ethereumAddress !== undefined &&
      object.ethereumAddress !== null
    ) {
      message.ethereumAddress = object.ethereumAddress;
    } else {
      message.ethereumAddress = "";
    }
    return message;
  },
};
const baseValset = {
  nonce: long_1.default.UZERO,
  height: long_1.default.UZERO,
  rewardAmount: "",
  rewardToken: "",
};
exports.Valset = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (!message.nonce.isZero()) {
      writer.uint32(8).uint64(message.nonce);
    }
    for (const v of message.members) {
      exports.BridgeValidator.encode(v, writer.uint32(18).fork()).ldelim();
    }
    if (!message.height.isZero()) {
      writer.uint32(24).uint64(message.height);
    }
    if (message.rewardAmount !== "") {
      writer.uint32(34).string(message.rewardAmount);
    }
    if (message.rewardToken !== "") {
      writer.uint32(42).string(message.rewardToken);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : new minimal_1.default.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.assign({}, baseValset);
    message.members = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = reader.uint64();
          break;
        case 2:
          message.members.push(
            exports.BridgeValidator.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.height = reader.uint64();
          break;
        case 4:
          message.rewardAmount = reader.string();
          break;
        case 5:
          message.rewardToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    const message = Object.assign({}, baseValset);
    message.members = [];
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = long_1.default.fromString(object.nonce);
    } else {
      message.nonce = long_1.default.UZERO;
    }
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(exports.BridgeValidator.fromJSON(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = long_1.default.fromString(object.height);
    } else {
      message.height = long_1.default.UZERO;
    }
    if (object.rewardAmount !== undefined && object.rewardAmount !== null) {
      message.rewardAmount = String(object.rewardAmount);
    } else {
      message.rewardAmount = "";
    }
    if (object.rewardToken !== undefined && object.rewardToken !== null) {
      message.rewardToken = String(object.rewardToken);
    } else {
      message.rewardToken = "";
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    message.nonce !== undefined &&
      (obj.nonce = (message.nonce || long_1.default.UZERO).toString());
    if (message.members) {
      obj.members = message.members.map(e =>
        e ? exports.BridgeValidator.toJSON(e) : undefined
      );
    } else {
      obj.members = [];
    }
    message.height !== undefined &&
      (obj.height = (message.height || long_1.default.UZERO).toString());
    message.rewardAmount !== undefined &&
      (obj.rewardAmount = message.rewardAmount);
    message.rewardToken !== undefined &&
      (obj.rewardToken = message.rewardToken);
    return obj;
  },
  fromPartial(object) {
    const message = Object.assign({}, baseValset);
    message.members = [];
    if (object.nonce !== undefined && object.nonce !== null) {
      message.nonce = object.nonce;
    } else {
      message.nonce = long_1.default.UZERO;
    }
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(exports.BridgeValidator.fromPartial(e));
      }
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height;
    } else {
      message.height = long_1.default.UZERO;
    }
    if (object.rewardAmount !== undefined && object.rewardAmount !== null) {
      message.rewardAmount = object.rewardAmount;
    } else {
      message.rewardAmount = "";
    }
    if (object.rewardToken !== undefined && object.rewardToken !== null) {
      message.rewardToken = object.rewardToken;
    } else {
      message.rewardToken = "";
    }
    return message;
  },
};
const baseLastObservedEthereumBlockHeight = {
  cosmosBlockHeight: long_1.default.UZERO,
  ethereumBlockHeight: long_1.default.UZERO,
};
exports.LastObservedEthereumBlockHeight = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (!message.cosmosBlockHeight.isZero()) {
      writer.uint32(8).uint64(message.cosmosBlockHeight);
    }
    if (!message.ethereumBlockHeight.isZero()) {
      writer.uint32(16).uint64(message.ethereumBlockHeight);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : new minimal_1.default.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.assign({}, baseLastObservedEthereumBlockHeight);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cosmosBlockHeight = reader.uint64();
          break;
        case 2:
          message.ethereumBlockHeight = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    const message = Object.assign({}, baseLastObservedEthereumBlockHeight);
    if (
      object.cosmosBlockHeight !== undefined &&
      object.cosmosBlockHeight !== null
    ) {
      message.cosmosBlockHeight = long_1.default.fromString(
        object.cosmosBlockHeight
      );
    } else {
      message.cosmosBlockHeight = long_1.default.UZERO;
    }
    if (
      object.ethereumBlockHeight !== undefined &&
      object.ethereumBlockHeight !== null
    ) {
      message.ethereumBlockHeight = long_1.default.fromString(
        object.ethereumBlockHeight
      );
    } else {
      message.ethereumBlockHeight = long_1.default.UZERO;
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    message.cosmosBlockHeight !== undefined &&
      (obj.cosmosBlockHeight = (
        message.cosmosBlockHeight || long_1.default.UZERO
      ).toString());
    message.ethereumBlockHeight !== undefined &&
      (obj.ethereumBlockHeight = (
        message.ethereumBlockHeight || long_1.default.UZERO
      ).toString());
    return obj;
  },
  fromPartial(object) {
    const message = Object.assign({}, baseLastObservedEthereumBlockHeight);
    if (
      object.cosmosBlockHeight !== undefined &&
      object.cosmosBlockHeight !== null
    ) {
      message.cosmosBlockHeight = object.cosmosBlockHeight;
    } else {
      message.cosmosBlockHeight = long_1.default.UZERO;
    }
    if (
      object.ethereumBlockHeight !== undefined &&
      object.ethereumBlockHeight !== null
    ) {
      message.ethereumBlockHeight = object.ethereumBlockHeight;
    } else {
      message.ethereumBlockHeight = long_1.default.UZERO;
    }
    return message;
  },
};
const baseERC20ToDenom = { erc20: "", denom: "" };
exports.ERC20ToDenom = {
  encode(message, writer = minimal_1.default.Writer.create()) {
    if (message.erc20 !== "") {
      writer.uint32(10).string(message.erc20);
    }
    if (message.denom !== "") {
      writer.uint32(18).string(message.denom);
    }
    return writer;
  },
  decode(input, length) {
    const reader =
      input instanceof minimal_1.default.Reader
        ? input
        : new minimal_1.default.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.assign({}, baseERC20ToDenom);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.erc20 = reader.string();
          break;
        case 2:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object) {
    const message = Object.assign({}, baseERC20ToDenom);
    if (object.erc20 !== undefined && object.erc20 !== null) {
      message.erc20 = String(object.erc20);
    } else {
      message.erc20 = "";
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = String(object.denom);
    } else {
      message.denom = "";
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    message.erc20 !== undefined && (obj.erc20 = message.erc20);
    message.denom !== undefined && (obj.denom = message.denom);
    return obj;
  },
  fromPartial(object) {
    const message = Object.assign({}, baseERC20ToDenom);
    if (object.erc20 !== undefined && object.erc20 !== null) {
      message.erc20 = object.erc20;
    } else {
      message.erc20 = "";
    }
    if (object.denom !== undefined && object.denom !== null) {
      message.denom = object.denom;
    } else {
      message.denom = "";
    }
    return message;
  },
};
if (minimal_1.default.util.Long !== long_1.default) {
  minimal_1.default.util.Long = long_1.default;
  minimal_1.default.configure();
}
