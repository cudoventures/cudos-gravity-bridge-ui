"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const coin_1 = require("../../cosmos/base/v1beta1/coin");
const any_1 = require("../../google/protobuf/any");
const types_1 = require("../../gravity/v1/types");
exports.protobufPackage = "gravity.v1";
const baseMsgSetOrchestratorAddress = {
    validator: "",
    orchestrator: "",
    ethAddress: "",
};
exports.MsgSetOrchestratorAddress = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.validator !== "") {
            writer.uint32(10).string(message.validator);
        }
        if (message.orchestrator !== "") {
            writer.uint32(18).string(message.orchestrator);
        }
        if (message.ethAddress !== "") {
            writer.uint32(26).string(message.ethAddress);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSetOrchestratorAddress);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.validator = reader.string();
                    break;
                case 2:
                    message.orchestrator = reader.string();
                    break;
                case 3:
                    message.ethAddress = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSetOrchestratorAddress);
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = String(object.validator);
        }
        else {
            message.validator = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        if (object.ethAddress !== undefined && object.ethAddress !== null) {
            message.ethAddress = String(object.ethAddress);
        }
        else {
            message.ethAddress = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.validator !== undefined && (obj.validator = message.validator);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        message.ethAddress !== undefined && (obj.ethAddress = message.ethAddress);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSetOrchestratorAddress);
        if (object.validator !== undefined && object.validator !== null) {
            message.validator = object.validator;
        }
        else {
            message.validator = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        if (object.ethAddress !== undefined && object.ethAddress !== null) {
            message.ethAddress = object.ethAddress;
        }
        else {
            message.ethAddress = "";
        }
        return message;
    },
};
const baseMsgSetOrchestratorAddressResponse = {};
exports.MsgSetOrchestratorAddressResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSetOrchestratorAddressResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgSetOrchestratorAddressResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSetOrchestratorAddressResponse);
        return message;
    },
};
const baseMsgValsetConfirm = {
    nonce: long_1.default.UZERO,
    orchestrator: "",
    ethAddress: "",
    signature: "",
};
exports.MsgValsetConfirm = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.nonce.isZero()) {
            writer.uint32(8).uint64(message.nonce);
        }
        if (message.orchestrator !== "") {
            writer.uint32(18).string(message.orchestrator);
        }
        if (message.ethAddress !== "") {
            writer.uint32(26).string(message.ethAddress);
        }
        if (message.signature !== "") {
            writer.uint32(34).string(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgValsetConfirm);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nonce = reader.uint64();
                    break;
                case 2:
                    message.orchestrator = reader.string();
                    break;
                case 3:
                    message.ethAddress = reader.string();
                    break;
                case 4:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgValsetConfirm);
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = long_1.default.fromString(object.nonce);
        }
        else {
            message.nonce = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        if (object.ethAddress !== undefined && object.ethAddress !== null) {
            message.ethAddress = String(object.ethAddress);
        }
        else {
            message.ethAddress = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.nonce !== undefined &&
            (obj.nonce = (message.nonce || long_1.default.UZERO).toString());
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        message.ethAddress !== undefined && (obj.ethAddress = message.ethAddress);
        message.signature !== undefined && (obj.signature = message.signature);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgValsetConfirm);
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = object.nonce;
        }
        else {
            message.nonce = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        if (object.ethAddress !== undefined && object.ethAddress !== null) {
            message.ethAddress = object.ethAddress;
        }
        else {
            message.ethAddress = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        return message;
    },
};
const baseMsgValsetConfirmResponse = {};
exports.MsgValsetConfirmResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgValsetConfirmResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgValsetConfirmResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgValsetConfirmResponse);
        return message;
    },
};
const baseMsgSendToEth = { sender: "", ethDest: "" };
exports.MsgSendToEth = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.ethDest !== "") {
            writer.uint32(18).string(message.ethDest);
        }
        if (message.amount !== undefined) {
            coin_1.Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
        }
        if (message.bridgeFee !== undefined) {
            coin_1.Coin.encode(message.bridgeFee, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendToEth);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
                    break;
                case 2:
                    message.ethDest = reader.string();
                    break;
                case 3:
                    message.amount = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.bridgeFee = coin_1.Coin.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSendToEth);
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = String(object.sender);
        }
        else {
            message.sender = "";
        }
        if (object.ethDest !== undefined && object.ethDest !== null) {
            message.ethDest = String(object.ethDest);
        }
        else {
            message.ethDest = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = coin_1.Coin.fromJSON(object.amount);
        }
        else {
            message.amount = undefined;
        }
        if (object.bridgeFee !== undefined && object.bridgeFee !== null) {
            message.bridgeFee = coin_1.Coin.fromJSON(object.bridgeFee);
        }
        else {
            message.bridgeFee = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.ethDest !== undefined && (obj.ethDest = message.ethDest);
        message.amount !== undefined &&
            (obj.amount = message.amount ? coin_1.Coin.toJSON(message.amount) : undefined);
        message.bridgeFee !== undefined &&
            (obj.bridgeFee = message.bridgeFee
                ? coin_1.Coin.toJSON(message.bridgeFee)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSendToEth);
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        else {
            message.sender = "";
        }
        if (object.ethDest !== undefined && object.ethDest !== null) {
            message.ethDest = object.ethDest;
        }
        else {
            message.ethDest = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = coin_1.Coin.fromPartial(object.amount);
        }
        else {
            message.amount = undefined;
        }
        if (object.bridgeFee !== undefined && object.bridgeFee !== null) {
            message.bridgeFee = coin_1.Coin.fromPartial(object.bridgeFee);
        }
        else {
            message.bridgeFee = undefined;
        }
        return message;
    },
};
const baseMsgSendToEthResponse = {};
exports.MsgSendToEthResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendToEthResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgSendToEthResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSendToEthResponse);
        return message;
    },
};
const baseMsgRequestBatch = { sender: "", denom: "" };
exports.MsgRequestBatch = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.sender !== "") {
            writer.uint32(10).string(message.sender);
        }
        if (message.denom !== "") {
            writer.uint32(18).string(message.denom);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRequestBatch);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.sender = reader.string();
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
        const message = Object.assign({}, baseMsgRequestBatch);
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = String(object.sender);
        }
        else {
            message.sender = "";
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = String(object.denom);
        }
        else {
            message.denom = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.sender !== undefined && (obj.sender = message.sender);
        message.denom !== undefined && (obj.denom = message.denom);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgRequestBatch);
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        else {
            message.sender = "";
        }
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        else {
            message.denom = "";
        }
        return message;
    },
};
const baseMsgRequestBatchResponse = {};
exports.MsgRequestBatchResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgRequestBatchResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgRequestBatchResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgRequestBatchResponse);
        return message;
    },
};
const baseMsgConfirmBatch = {
    nonce: long_1.default.UZERO,
    tokenContract: "",
    ethSigner: "",
    orchestrator: "",
    signature: "",
};
exports.MsgConfirmBatch = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.nonce.isZero()) {
            writer.uint32(8).uint64(message.nonce);
        }
        if (message.tokenContract !== "") {
            writer.uint32(18).string(message.tokenContract);
        }
        if (message.ethSigner !== "") {
            writer.uint32(26).string(message.ethSigner);
        }
        if (message.orchestrator !== "") {
            writer.uint32(34).string(message.orchestrator);
        }
        if (message.signature !== "") {
            writer.uint32(42).string(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgConfirmBatch);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nonce = reader.uint64();
                    break;
                case 2:
                    message.tokenContract = reader.string();
                    break;
                case 3:
                    message.ethSigner = reader.string();
                    break;
                case 4:
                    message.orchestrator = reader.string();
                    break;
                case 5:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgConfirmBatch);
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = long_1.default.fromString(object.nonce);
        }
        else {
            message.nonce = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = String(object.tokenContract);
        }
        else {
            message.tokenContract = "";
        }
        if (object.ethSigner !== undefined && object.ethSigner !== null) {
            message.ethSigner = String(object.ethSigner);
        }
        else {
            message.ethSigner = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.nonce !== undefined &&
            (obj.nonce = (message.nonce || long_1.default.UZERO).toString());
        message.tokenContract !== undefined &&
            (obj.tokenContract = message.tokenContract);
        message.ethSigner !== undefined && (obj.ethSigner = message.ethSigner);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        message.signature !== undefined && (obj.signature = message.signature);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgConfirmBatch);
        if (object.nonce !== undefined && object.nonce !== null) {
            message.nonce = object.nonce;
        }
        else {
            message.nonce = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = object.tokenContract;
        }
        else {
            message.tokenContract = "";
        }
        if (object.ethSigner !== undefined && object.ethSigner !== null) {
            message.ethSigner = object.ethSigner;
        }
        else {
            message.ethSigner = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        return message;
    },
};
const baseMsgConfirmBatchResponse = {};
exports.MsgConfirmBatchResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgConfirmBatchResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgConfirmBatchResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgConfirmBatchResponse);
        return message;
    },
};
const baseMsgConfirmLogicCall = {
    invalidationId: "",
    invalidationNonce: long_1.default.UZERO,
    ethSigner: "",
    orchestrator: "",
    signature: "",
};
exports.MsgConfirmLogicCall = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.invalidationId !== "") {
            writer.uint32(10).string(message.invalidationId);
        }
        if (!message.invalidationNonce.isZero()) {
            writer.uint32(16).uint64(message.invalidationNonce);
        }
        if (message.ethSigner !== "") {
            writer.uint32(26).string(message.ethSigner);
        }
        if (message.orchestrator !== "") {
            writer.uint32(34).string(message.orchestrator);
        }
        if (message.signature !== "") {
            writer.uint32(42).string(message.signature);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgConfirmLogicCall);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.invalidationId = reader.string();
                    break;
                case 2:
                    message.invalidationNonce = reader.uint64();
                    break;
                case 3:
                    message.ethSigner = reader.string();
                    break;
                case 4:
                    message.orchestrator = reader.string();
                    break;
                case 5:
                    message.signature = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgConfirmLogicCall);
        if (object.invalidationId !== undefined && object.invalidationId !== null) {
            message.invalidationId = String(object.invalidationId);
        }
        else {
            message.invalidationId = "";
        }
        if (object.invalidationNonce !== undefined &&
            object.invalidationNonce !== null) {
            message.invalidationNonce = long_1.default.fromString(object.invalidationNonce);
        }
        else {
            message.invalidationNonce = long_1.default.UZERO;
        }
        if (object.ethSigner !== undefined && object.ethSigner !== null) {
            message.ethSigner = String(object.ethSigner);
        }
        else {
            message.ethSigner = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.invalidationId !== undefined &&
            (obj.invalidationId = message.invalidationId);
        message.invalidationNonce !== undefined &&
            (obj.invalidationNonce = (message.invalidationNonce || long_1.default.UZERO).toString());
        message.ethSigner !== undefined && (obj.ethSigner = message.ethSigner);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        message.signature !== undefined && (obj.signature = message.signature);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgConfirmLogicCall);
        if (object.invalidationId !== undefined && object.invalidationId !== null) {
            message.invalidationId = object.invalidationId;
        }
        else {
            message.invalidationId = "";
        }
        if (object.invalidationNonce !== undefined &&
            object.invalidationNonce !== null) {
            message.invalidationNonce = object.invalidationNonce;
        }
        else {
            message.invalidationNonce = long_1.default.UZERO;
        }
        if (object.ethSigner !== undefined && object.ethSigner !== null) {
            message.ethSigner = object.ethSigner;
        }
        else {
            message.ethSigner = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        return message;
    },
};
const baseMsgConfirmLogicCallResponse = {};
exports.MsgConfirmLogicCallResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgConfirmLogicCallResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgConfirmLogicCallResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgConfirmLogicCallResponse);
        return message;
    },
};
const baseMsgSendToCosmosClaim = {
    eventNonce: long_1.default.UZERO,
    blockHeight: long_1.default.UZERO,
    tokenContract: "",
    amount: "",
    ethereumSender: "",
    cosmosReceiver: "",
    orchestrator: "",
};
exports.MsgSendToCosmosClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.eventNonce.isZero()) {
            writer.uint32(8).uint64(message.eventNonce);
        }
        if (!message.blockHeight.isZero()) {
            writer.uint32(16).uint64(message.blockHeight);
        }
        if (message.tokenContract !== "") {
            writer.uint32(26).string(message.tokenContract);
        }
        if (message.amount !== "") {
            writer.uint32(34).string(message.amount);
        }
        if (message.ethereumSender !== "") {
            writer.uint32(42).string(message.ethereumSender);
        }
        if (message.cosmosReceiver !== "") {
            writer.uint32(50).string(message.cosmosReceiver);
        }
        if (message.orchestrator !== "") {
            writer.uint32(58).string(message.orchestrator);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendToCosmosClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.eventNonce = reader.uint64();
                    break;
                case 2:
                    message.blockHeight = reader.uint64();
                    break;
                case 3:
                    message.tokenContract = reader.string();
                    break;
                case 4:
                    message.amount = reader.string();
                    break;
                case 5:
                    message.ethereumSender = reader.string();
                    break;
                case 6:
                    message.cosmosReceiver = reader.string();
                    break;
                case 7:
                    message.orchestrator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSendToCosmosClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = long_1.default.fromString(object.eventNonce);
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = long_1.default.fromString(object.blockHeight);
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = String(object.tokenContract);
        }
        else {
            message.tokenContract = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = String(object.amount);
        }
        else {
            message.amount = "";
        }
        if (object.ethereumSender !== undefined && object.ethereumSender !== null) {
            message.ethereumSender = String(object.ethereumSender);
        }
        else {
            message.ethereumSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = String(object.cosmosReceiver);
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.eventNonce !== undefined &&
            (obj.eventNonce = (message.eventNonce || long_1.default.UZERO).toString());
        message.blockHeight !== undefined &&
            (obj.blockHeight = (message.blockHeight || long_1.default.UZERO).toString());
        message.tokenContract !== undefined &&
            (obj.tokenContract = message.tokenContract);
        message.amount !== undefined && (obj.amount = message.amount);
        message.ethereumSender !== undefined &&
            (obj.ethereumSender = message.ethereumSender);
        message.cosmosReceiver !== undefined &&
            (obj.cosmosReceiver = message.cosmosReceiver);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSendToCosmosClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = object.eventNonce;
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = object.blockHeight;
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = object.tokenContract;
        }
        else {
            message.tokenContract = "";
        }
        if (object.amount !== undefined && object.amount !== null) {
            message.amount = object.amount;
        }
        else {
            message.amount = "";
        }
        if (object.ethereumSender !== undefined && object.ethereumSender !== null) {
            message.ethereumSender = object.ethereumSender;
        }
        else {
            message.ethereumSender = "";
        }
        if (object.cosmosReceiver !== undefined && object.cosmosReceiver !== null) {
            message.cosmosReceiver = object.cosmosReceiver;
        }
        else {
            message.cosmosReceiver = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
};
const baseMsgSendToCosmosClaimResponse = {};
exports.MsgSendToCosmosClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSendToCosmosClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgSendToCosmosClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSendToCosmosClaimResponse);
        return message;
    },
};
const baseMsgBatchSendToEthClaim = {
    eventNonce: long_1.default.UZERO,
    blockHeight: long_1.default.UZERO,
    batchNonce: long_1.default.UZERO,
    tokenContract: "",
    orchestrator: "",
};
exports.MsgBatchSendToEthClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.eventNonce.isZero()) {
            writer.uint32(8).uint64(message.eventNonce);
        }
        if (!message.blockHeight.isZero()) {
            writer.uint32(16).uint64(message.blockHeight);
        }
        if (!message.batchNonce.isZero()) {
            writer.uint32(24).uint64(message.batchNonce);
        }
        if (message.tokenContract !== "") {
            writer.uint32(34).string(message.tokenContract);
        }
        if (message.orchestrator !== "") {
            writer.uint32(42).string(message.orchestrator);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgBatchSendToEthClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.eventNonce = reader.uint64();
                    break;
                case 2:
                    message.blockHeight = reader.uint64();
                    break;
                case 3:
                    message.batchNonce = reader.uint64();
                    break;
                case 4:
                    message.tokenContract = reader.string();
                    break;
                case 5:
                    message.orchestrator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgBatchSendToEthClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = long_1.default.fromString(object.eventNonce);
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = long_1.default.fromString(object.blockHeight);
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.batchNonce !== undefined && object.batchNonce !== null) {
            message.batchNonce = long_1.default.fromString(object.batchNonce);
        }
        else {
            message.batchNonce = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = String(object.tokenContract);
        }
        else {
            message.tokenContract = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.eventNonce !== undefined &&
            (obj.eventNonce = (message.eventNonce || long_1.default.UZERO).toString());
        message.blockHeight !== undefined &&
            (obj.blockHeight = (message.blockHeight || long_1.default.UZERO).toString());
        message.batchNonce !== undefined &&
            (obj.batchNonce = (message.batchNonce || long_1.default.UZERO).toString());
        message.tokenContract !== undefined &&
            (obj.tokenContract = message.tokenContract);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgBatchSendToEthClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = object.eventNonce;
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = object.blockHeight;
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.batchNonce !== undefined && object.batchNonce !== null) {
            message.batchNonce = object.batchNonce;
        }
        else {
            message.batchNonce = long_1.default.UZERO;
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = object.tokenContract;
        }
        else {
            message.tokenContract = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
};
const baseMsgBatchSendToEthClaimResponse = {};
exports.MsgBatchSendToEthClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgBatchSendToEthClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgBatchSendToEthClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgBatchSendToEthClaimResponse);
        return message;
    },
};
const baseMsgERC20DeployedClaim = {
    eventNonce: long_1.default.UZERO,
    blockHeight: long_1.default.UZERO,
    cosmosDenom: "",
    tokenContract: "",
    name: "",
    symbol: "",
    decimals: long_1.default.UZERO,
    orchestrator: "",
};
exports.MsgERC20DeployedClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.eventNonce.isZero()) {
            writer.uint32(8).uint64(message.eventNonce);
        }
        if (!message.blockHeight.isZero()) {
            writer.uint32(16).uint64(message.blockHeight);
        }
        if (message.cosmosDenom !== "") {
            writer.uint32(26).string(message.cosmosDenom);
        }
        if (message.tokenContract !== "") {
            writer.uint32(34).string(message.tokenContract);
        }
        if (message.name !== "") {
            writer.uint32(42).string(message.name);
        }
        if (message.symbol !== "") {
            writer.uint32(50).string(message.symbol);
        }
        if (!message.decimals.isZero()) {
            writer.uint32(56).uint64(message.decimals);
        }
        if (message.orchestrator !== "") {
            writer.uint32(66).string(message.orchestrator);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgERC20DeployedClaim);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.eventNonce = reader.uint64();
                    break;
                case 2:
                    message.blockHeight = reader.uint64();
                    break;
                case 3:
                    message.cosmosDenom = reader.string();
                    break;
                case 4:
                    message.tokenContract = reader.string();
                    break;
                case 5:
                    message.name = reader.string();
                    break;
                case 6:
                    message.symbol = reader.string();
                    break;
                case 7:
                    message.decimals = reader.uint64();
                    break;
                case 8:
                    message.orchestrator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgERC20DeployedClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = long_1.default.fromString(object.eventNonce);
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = long_1.default.fromString(object.blockHeight);
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.cosmosDenom !== undefined && object.cosmosDenom !== null) {
            message.cosmosDenom = String(object.cosmosDenom);
        }
        else {
            message.cosmosDenom = "";
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = String(object.tokenContract);
        }
        else {
            message.tokenContract = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = String(object.symbol);
        }
        else {
            message.symbol = "";
        }
        if (object.decimals !== undefined && object.decimals !== null) {
            message.decimals = long_1.default.fromString(object.decimals);
        }
        else {
            message.decimals = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.eventNonce !== undefined &&
            (obj.eventNonce = (message.eventNonce || long_1.default.UZERO).toString());
        message.blockHeight !== undefined &&
            (obj.blockHeight = (message.blockHeight || long_1.default.UZERO).toString());
        message.cosmosDenom !== undefined &&
            (obj.cosmosDenom = message.cosmosDenom);
        message.tokenContract !== undefined &&
            (obj.tokenContract = message.tokenContract);
        message.name !== undefined && (obj.name = message.name);
        message.symbol !== undefined && (obj.symbol = message.symbol);
        message.decimals !== undefined &&
            (obj.decimals = (message.decimals || long_1.default.UZERO).toString());
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgERC20DeployedClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = object.eventNonce;
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = object.blockHeight;
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.cosmosDenom !== undefined && object.cosmosDenom !== null) {
            message.cosmosDenom = object.cosmosDenom;
        }
        else {
            message.cosmosDenom = "";
        }
        if (object.tokenContract !== undefined && object.tokenContract !== null) {
            message.tokenContract = object.tokenContract;
        }
        else {
            message.tokenContract = "";
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = "";
        }
        if (object.symbol !== undefined && object.symbol !== null) {
            message.symbol = object.symbol;
        }
        else {
            message.symbol = "";
        }
        if (object.decimals !== undefined && object.decimals !== null) {
            message.decimals = object.decimals;
        }
        else {
            message.decimals = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
};
const baseMsgERC20DeployedClaimResponse = {};
exports.MsgERC20DeployedClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgERC20DeployedClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgERC20DeployedClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgERC20DeployedClaimResponse);
        return message;
    },
};
const baseMsgLogicCallExecutedClaim = {
    eventNonce: long_1.default.UZERO,
    blockHeight: long_1.default.UZERO,
    invalidationNonce: long_1.default.UZERO,
    orchestrator: "",
};
exports.MsgLogicCallExecutedClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.eventNonce.isZero()) {
            writer.uint32(8).uint64(message.eventNonce);
        }
        if (!message.blockHeight.isZero()) {
            writer.uint32(16).uint64(message.blockHeight);
        }
        if (message.invalidationId.length !== 0) {
            writer.uint32(26).bytes(message.invalidationId);
        }
        if (!message.invalidationNonce.isZero()) {
            writer.uint32(32).uint64(message.invalidationNonce);
        }
        if (message.orchestrator !== "") {
            writer.uint32(42).string(message.orchestrator);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgLogicCallExecutedClaim);
        message.invalidationId = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.eventNonce = reader.uint64();
                    break;
                case 2:
                    message.blockHeight = reader.uint64();
                    break;
                case 3:
                    message.invalidationId = reader.bytes();
                    break;
                case 4:
                    message.invalidationNonce = reader.uint64();
                    break;
                case 5:
                    message.orchestrator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgLogicCallExecutedClaim);
        message.invalidationId = new Uint8Array();
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = long_1.default.fromString(object.eventNonce);
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = long_1.default.fromString(object.blockHeight);
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.invalidationId !== undefined && object.invalidationId !== null) {
            message.invalidationId = bytesFromBase64(object.invalidationId);
        }
        if (object.invalidationNonce !== undefined &&
            object.invalidationNonce !== null) {
            message.invalidationNonce = long_1.default.fromString(object.invalidationNonce);
        }
        else {
            message.invalidationNonce = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.eventNonce !== undefined &&
            (obj.eventNonce = (message.eventNonce || long_1.default.UZERO).toString());
        message.blockHeight !== undefined &&
            (obj.blockHeight = (message.blockHeight || long_1.default.UZERO).toString());
        message.invalidationId !== undefined &&
            (obj.invalidationId = base64FromBytes(message.invalidationId !== undefined
                ? message.invalidationId
                : new Uint8Array()));
        message.invalidationNonce !== undefined &&
            (obj.invalidationNonce = (message.invalidationNonce || long_1.default.UZERO).toString());
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgLogicCallExecutedClaim);
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = object.eventNonce;
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = object.blockHeight;
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.invalidationId !== undefined && object.invalidationId !== null) {
            message.invalidationId = object.invalidationId;
        }
        else {
            message.invalidationId = new Uint8Array();
        }
        if (object.invalidationNonce !== undefined &&
            object.invalidationNonce !== null) {
            message.invalidationNonce = object.invalidationNonce;
        }
        else {
            message.invalidationNonce = long_1.default.UZERO;
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
};
const baseMsgLogicCallExecutedClaimResponse = {};
exports.MsgLogicCallExecutedClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgLogicCallExecutedClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgLogicCallExecutedClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgLogicCallExecutedClaimResponse);
        return message;
    },
};
const baseMsgValsetUpdatedClaim = {
    eventNonce: long_1.default.UZERO,
    valsetNonce: long_1.default.UZERO,
    blockHeight: long_1.default.UZERO,
    rewardAmount: "",
    rewardToken: "",
    orchestrator: "",
};
exports.MsgValsetUpdatedClaim = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.eventNonce.isZero()) {
            writer.uint32(8).uint64(message.eventNonce);
        }
        if (!message.valsetNonce.isZero()) {
            writer.uint32(16).uint64(message.valsetNonce);
        }
        if (!message.blockHeight.isZero()) {
            writer.uint32(24).uint64(message.blockHeight);
        }
        for (const v of message.members) {
            types_1.BridgeValidator.encode(v, writer.uint32(34).fork()).ldelim();
        }
        if (message.rewardAmount !== "") {
            writer.uint32(42).string(message.rewardAmount);
        }
        if (message.rewardToken !== "") {
            writer.uint32(50).string(message.rewardToken);
        }
        if (message.orchestrator !== "") {
            writer.uint32(58).string(message.orchestrator);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgValsetUpdatedClaim);
        message.members = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.eventNonce = reader.uint64();
                    break;
                case 2:
                    message.valsetNonce = reader.uint64();
                    break;
                case 3:
                    message.blockHeight = reader.uint64();
                    break;
                case 4:
                    message.members.push(types_1.BridgeValidator.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.rewardAmount = reader.string();
                    break;
                case 6:
                    message.rewardToken = reader.string();
                    break;
                case 7:
                    message.orchestrator = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgValsetUpdatedClaim);
        message.members = [];
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = long_1.default.fromString(object.eventNonce);
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.valsetNonce !== undefined && object.valsetNonce !== null) {
            message.valsetNonce = long_1.default.fromString(object.valsetNonce);
        }
        else {
            message.valsetNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = long_1.default.fromString(object.blockHeight);
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.members !== undefined && object.members !== null) {
            for (const e of object.members) {
                message.members.push(types_1.BridgeValidator.fromJSON(e));
            }
        }
        if (object.rewardAmount !== undefined && object.rewardAmount !== null) {
            message.rewardAmount = String(object.rewardAmount);
        }
        else {
            message.rewardAmount = "";
        }
        if (object.rewardToken !== undefined && object.rewardToken !== null) {
            message.rewardToken = String(object.rewardToken);
        }
        else {
            message.rewardToken = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = String(object.orchestrator);
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.eventNonce !== undefined &&
            (obj.eventNonce = (message.eventNonce || long_1.default.UZERO).toString());
        message.valsetNonce !== undefined &&
            (obj.valsetNonce = (message.valsetNonce || long_1.default.UZERO).toString());
        message.blockHeight !== undefined &&
            (obj.blockHeight = (message.blockHeight || long_1.default.UZERO).toString());
        if (message.members) {
            obj.members = message.members.map((e) => e ? types_1.BridgeValidator.toJSON(e) : undefined);
        }
        else {
            obj.members = [];
        }
        message.rewardAmount !== undefined &&
            (obj.rewardAmount = message.rewardAmount);
        message.rewardToken !== undefined &&
            (obj.rewardToken = message.rewardToken);
        message.orchestrator !== undefined &&
            (obj.orchestrator = message.orchestrator);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgValsetUpdatedClaim);
        message.members = [];
        if (object.eventNonce !== undefined && object.eventNonce !== null) {
            message.eventNonce = object.eventNonce;
        }
        else {
            message.eventNonce = long_1.default.UZERO;
        }
        if (object.valsetNonce !== undefined && object.valsetNonce !== null) {
            message.valsetNonce = object.valsetNonce;
        }
        else {
            message.valsetNonce = long_1.default.UZERO;
        }
        if (object.blockHeight !== undefined && object.blockHeight !== null) {
            message.blockHeight = object.blockHeight;
        }
        else {
            message.blockHeight = long_1.default.UZERO;
        }
        if (object.members !== undefined && object.members !== null) {
            for (const e of object.members) {
                message.members.push(types_1.BridgeValidator.fromPartial(e));
            }
        }
        if (object.rewardAmount !== undefined && object.rewardAmount !== null) {
            message.rewardAmount = object.rewardAmount;
        }
        else {
            message.rewardAmount = "";
        }
        if (object.rewardToken !== undefined && object.rewardToken !== null) {
            message.rewardToken = object.rewardToken;
        }
        else {
            message.rewardToken = "";
        }
        if (object.orchestrator !== undefined && object.orchestrator !== null) {
            message.orchestrator = object.orchestrator;
        }
        else {
            message.orchestrator = "";
        }
        return message;
    },
};
const baseMsgValsetUpdatedClaimResponse = {};
exports.MsgValsetUpdatedClaimResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgValsetUpdatedClaimResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgValsetUpdatedClaimResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgValsetUpdatedClaimResponse);
        return message;
    },
};
const baseMsgCancelSendToEth = {
    transactionId: long_1.default.UZERO,
    sender: "",
};
exports.MsgCancelSendToEth = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (!message.transactionId.isZero()) {
            writer.uint32(8).uint64(message.transactionId);
        }
        if (message.sender !== "") {
            writer.uint32(18).string(message.sender);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCancelSendToEth);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.transactionId = reader.uint64();
                    break;
                case 2:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgCancelSendToEth);
        if (object.transactionId !== undefined && object.transactionId !== null) {
            message.transactionId = long_1.default.fromString(object.transactionId);
        }
        else {
            message.transactionId = long_1.default.UZERO;
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = String(object.sender);
        }
        else {
            message.sender = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.transactionId !== undefined &&
            (obj.transactionId = (message.transactionId || long_1.default.UZERO).toString());
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgCancelSendToEth);
        if (object.transactionId !== undefined && object.transactionId !== null) {
            message.transactionId = object.transactionId;
        }
        else {
            message.transactionId = long_1.default.UZERO;
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        else {
            message.sender = "";
        }
        return message;
    },
};
const baseMsgCancelSendToEthResponse = {};
exports.MsgCancelSendToEthResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgCancelSendToEthResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgCancelSendToEthResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgCancelSendToEthResponse);
        return message;
    },
};
const baseMsgSubmitBadSignatureEvidence = { signature: "", sender: "" };
exports.MsgSubmitBadSignatureEvidence = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.subject !== undefined) {
            any_1.Any.encode(message.subject, writer.uint32(10).fork()).ldelim();
        }
        if (message.signature !== "") {
            writer.uint32(18).string(message.signature);
        }
        if (message.sender !== "") {
            writer.uint32(26).string(message.sender);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidence);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.subject = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.signature = reader.string();
                    break;
                case 3:
                    message.sender = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidence);
        if (object.subject !== undefined && object.subject !== null) {
            message.subject = any_1.Any.fromJSON(object.subject);
        }
        else {
            message.subject = undefined;
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = String(object.signature);
        }
        else {
            message.signature = "";
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = String(object.sender);
        }
        else {
            message.sender = "";
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.subject !== undefined &&
            (obj.subject = message.subject ? any_1.Any.toJSON(message.subject) : undefined);
        message.signature !== undefined && (obj.signature = message.signature);
        message.sender !== undefined && (obj.sender = message.sender);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidence);
        if (object.subject !== undefined && object.subject !== null) {
            message.subject = any_1.Any.fromPartial(object.subject);
        }
        else {
            message.subject = undefined;
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature;
        }
        else {
            message.signature = "";
        }
        if (object.sender !== undefined && object.sender !== null) {
            message.sender = object.sender;
        }
        else {
            message.sender = "";
        }
        return message;
    },
};
const baseMsgSubmitBadSignatureEvidenceResponse = {};
exports.MsgSubmitBadSignatureEvidenceResponse = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidenceResponse);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidenceResponse);
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = Object.assign({}, baseMsgSubmitBadSignatureEvidenceResponse);
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.ValsetConfirm = this.ValsetConfirm.bind(this);
        this.SendToEth = this.SendToEth.bind(this);
        this.RequestBatch = this.RequestBatch.bind(this);
        this.ConfirmBatch = this.ConfirmBatch.bind(this);
        this.ConfirmLogicCall = this.ConfirmLogicCall.bind(this);
        this.SendToCosmosClaim = this.SendToCosmosClaim.bind(this);
        this.BatchSendToEthClaim = this.BatchSendToEthClaim.bind(this);
        this.ValsetUpdateClaim = this.ValsetUpdateClaim.bind(this);
        this.ERC20DeployedClaim = this.ERC20DeployedClaim.bind(this);
        this.LogicCallExecutedClaim = this.LogicCallExecutedClaim.bind(this);
        this.SetOrchestratorAddress = this.SetOrchestratorAddress.bind(this);
        this.CancelSendToEth = this.CancelSendToEth.bind(this);
        this.SubmitBadSignatureEvidence =
            this.SubmitBadSignatureEvidence.bind(this);
    }
    ValsetConfirm(request) {
        const data = exports.MsgValsetConfirm.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "ValsetConfirm", data);
        return promise.then((data) => exports.MsgValsetConfirmResponse.decode(new minimal_1.default.Reader(data)));
    }
    SendToEth(request) {
        const data = exports.MsgSendToEth.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "SendToEth", data);
        return promise.then((data) => exports.MsgSendToEthResponse.decode(new minimal_1.default.Reader(data)));
    }
    RequestBatch(request) {
        const data = exports.MsgRequestBatch.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "RequestBatch", data);
        return promise.then((data) => exports.MsgRequestBatchResponse.decode(new minimal_1.default.Reader(data)));
    }
    ConfirmBatch(request) {
        const data = exports.MsgConfirmBatch.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "ConfirmBatch", data);
        return promise.then((data) => exports.MsgConfirmBatchResponse.decode(new minimal_1.default.Reader(data)));
    }
    ConfirmLogicCall(request) {
        const data = exports.MsgConfirmLogicCall.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "ConfirmLogicCall", data);
        return promise.then((data) => exports.MsgConfirmLogicCallResponse.decode(new minimal_1.default.Reader(data)));
    }
    SendToCosmosClaim(request) {
        const data = exports.MsgSendToCosmosClaim.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "SendToCosmosClaim", data);
        return promise.then((data) => exports.MsgSendToCosmosClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    BatchSendToEthClaim(request) {
        const data = exports.MsgBatchSendToEthClaim.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "BatchSendToEthClaim", data);
        return promise.then((data) => exports.MsgBatchSendToEthClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    ValsetUpdateClaim(request) {
        const data = exports.MsgValsetUpdatedClaim.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "ValsetUpdateClaim", data);
        return promise.then((data) => exports.MsgValsetUpdatedClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    ERC20DeployedClaim(request) {
        const data = exports.MsgERC20DeployedClaim.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "ERC20DeployedClaim", data);
        return promise.then((data) => exports.MsgERC20DeployedClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    LogicCallExecutedClaim(request) {
        const data = exports.MsgLogicCallExecutedClaim.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "LogicCallExecutedClaim", data);
        return promise.then((data) => exports.MsgLogicCallExecutedClaimResponse.decode(new minimal_1.default.Reader(data)));
    }
    SetOrchestratorAddress(request) {
        const data = exports.MsgSetOrchestratorAddress.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "SetOrchestratorAddress", data);
        return promise.then((data) => exports.MsgSetOrchestratorAddressResponse.decode(new minimal_1.default.Reader(data)));
    }
    CancelSendToEth(request) {
        const data = exports.MsgCancelSendToEth.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "CancelSendToEth", data);
        return promise.then((data) => exports.MsgCancelSendToEthResponse.decode(new minimal_1.default.Reader(data)));
    }
    SubmitBadSignatureEvidence(request) {
        const data = exports.MsgSubmitBadSignatureEvidence.encode(request).finish();
        const promise = this.rpc.request("gravity.v1.Msg", "SubmitBadSignatureEvidence", data);
        return promise.then((data) => exports.MsgSubmitBadSignatureEvidenceResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (let i = 0; i < arr.byteLength; ++i) {
        bin.push(String.fromCharCode(arr[i]));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
