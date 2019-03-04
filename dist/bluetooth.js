"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("util");
var noble = require("noble");
var LaunchBluetooth = /** @class */ (function () {
    function LaunchBluetooth() {
        this.serviceUUID = "88f80580000001e6aace0002a5d5c51b";
        this.charUUIDs = { cmd: "88f80583000001e6aace0002a5d5c51b",
            // sensor: "88f80582-0000-01e6-aace-0002a5d5c51b",
            data: "88f80581000001e6aace0002a5d5c51b" };
    }
    LaunchBluetooth.prototype.findLaunch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, rej, startup, launchFinder, _a, connectAsync, discoverServicesAsync, _b, discoverCharsAsync, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        startup = new Promise(function (aRes, aRej) { res = aRes; rej = aRej; });
                        noble.on("stateChange", function (state) {
                            if (state === "poweredOn") {
                                noble.startScanning();
                                res();
                            }
                            else {
                                noble.stopScanning();
                                rej();
                            }
                        });
                        return [4 /*yield*/, startup];
                    case 1:
                        _e.sent();
                        launchFinder = new Promise(function (aRes, aRej) { res = aRes; rej = aRej; });
                        noble.on("discover", function (d) {
                            if (d.advertisement.localName === "Launch") {
                                res(d);
                            }
                        });
                        _a = this;
                        return [4 /*yield*/, launchFinder];
                    case 2:
                        _a.device = _e.sent();
                        connectAsync = util.promisify(this.device.connect.bind(this.device));
                        discoverServicesAsync = util.promisify(this.device.discoverServices.bind(this.device));
                        return [4 /*yield*/, connectAsync()];
                    case 3:
                        _e.sent();
                        _b = this;
                        return [4 /*yield*/, discoverServicesAsync([this.serviceUUID])];
                    case 4:
                        _b.service = (_e.sent())[0];
                        discoverCharsAsync = util.promisify(this.service.discoverCharacteristics.bind(this.service));
                        _c = this;
                        return [4 /*yield*/, discoverCharsAsync([this.charUUIDs.cmd])];
                    case 5:
                        _c.cmdChar = (_e.sent())[0];
                        _d = this;
                        return [4 /*yield*/, discoverCharsAsync([this.charUUIDs.data])];
                    case 6:
                        _d.dataChar = (_e.sent())[0];
                        return [2 /*return*/];
                }
            });
        });
    };
    LaunchBluetooth.prototype.readCmd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util.promisify(this.cmdChar.read.bind(this.cmdChar))()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.writeCmd = function (aData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util.promisify(this.cmdChar.write.bind(this.cmdChar))(aData, false)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.readData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util.promisify(this.dataChar.read.bind(this.dataChar))()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.writeData = function (aData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util.promisify(this.dataChar.write.bind(this.dataChar))(aData, false)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.CommandWithResponse = function (aCommand, aData) {
        if (aData === void 0) { aData = 0x00; }
        return __awaiter(this, void 0, void 0, function () {
            var cmd, cmdRet, dataRet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cmd = Buffer.from([aCommand]);
                        return [4 /*yield*/, this.writeCmd(cmd)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.writeData(Buffer.from([aData]))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.readCmd()];
                    case 3:
                        cmdRet = _a.sent();
                        return [4 /*yield*/, this.readData()];
                    case 4:
                        dataRet = _a.sent();
                        return [2 /*return*/, dataRet];
                }
            });
        });
    };
    // Seems to be used after firmware loading to set machine back to app mode?
    LaunchBluetooth.prototype.LockAppMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.writeCmd(Buffer.from([0x0D]))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.writeData(Buffer.from([0x4F, 0x4B]))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LaunchBluetooth.prototype.GetVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.CommandWithResponse(0x05)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.GetExecutionMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.CommandWithResponse(0x03)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LaunchBluetooth.prototype.GetFlashInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flashInfo, i, is24BitAddressed, writeBlockCommandSize, flashEraseValue, addressIncrement, wordSize, programLength, programBase, rowSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.CommandWithResponse(0x0A)];
                    case 1:
                        flashInfo = _a.sent();
                        i = 0;
                        is24BitAddressed = flashInfo.length === 9;
                        writeBlockCommandSize = is24BitAddressed ? 3 : 2;
                        flashEraseValue = is24BitAddressed ? flashInfo.readUInt8(i) : 0xFF;
                        if (is24BitAddressed) {
                            i += 1;
                        }
                        addressIncrement = (flashInfo.readUInt8(i) & 0xF0) >> 4;
                        wordSize = flashInfo.readUInt8(i) & 0x0F;
                        i += 1;
                        programLength = flashInfo.readUInt16BE(i);
                        i += 2;
                        programBase = is24BitAddressed ?
                            // Ugh no 24-bit reads in node's buffer class.
                            flashInfo.readUInt8(i) | (flashInfo.readUInt16BE(i + 1) << 8) :
                            flashInfo.readUInt16BE(i);
                        i += is24BitAddressed ? 3 : 2;
                        rowSize = flashInfo.readUInt16BE(i);
                        return [2 /*return*/, {
                                writeBlockCommandSize: writeBlockCommandSize,
                                flashEraseValue: flashEraseValue,
                                programLength: programLength,
                                wordSize: wordSize,
                                addressIncrement: addressIncrement,
                                programBase: programBase,
                                rowSize: rowSize,
                            }];
                }
            });
        });
    };
    LaunchBluetooth.prototype.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readCmd()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.writeCmd(Buffer.from([0]))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LaunchBluetooth;
}());
exports.LaunchBluetooth = LaunchBluetooth;
//# sourceMappingURL=bluetooth.js.map