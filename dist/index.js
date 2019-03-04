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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var bluetooth_1 = require("./bluetooth");
var nrf_intel_hex_1 = require("nrf-intel-hex");
var util = require("util");
var fs = require("fs");
var readFileAsync = util.promisify(fs.readFile);
// cheap trick to get us from [[a, b], [c], [d, e]] to [a, b, c, d, e]
function flatten(aValue) {
    return [].concat.apply([], aValue);
}
// { writeBlockCommandSize: 2,
//   flashEraseValue: 255,
//   programLength: 240,
//   wordSize: 3,
//   addressIncrement: 2,
//   programBase: 8,
//   rowSize: 128 }
var firmwareFileTest = function () { return __awaiter(_this, void 0, void 0, function () {
    var aFlashInfo, hexFile, hexArrays, dataCommands, currentRow, startingAddress, programAddressLength, keyIter, eraseCommand, keyValue, currentBlock, commandArray, fillValue, commandLimit, commandsPerRowCommand, lineCounter, toggle, commandsRead, rowCommands, dataCommand;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                aFlashInfo = { writeBlockCommandSize: 2,
                    flashEraseValue: 255,
                    programRowLength: 240,
                    bytesPerAddress: 3,
                    addressIncrementSize: 2,
                    programStartRow: 8,
                    addressesPerRow: 128 };
                return [4 /*yield*/, readFileAsync("./Launch_V1.3.hex", { encoding: "ascii" })];
            case 1:
                hexFile = _a.sent();
                hexArrays = nrf_intel_hex_1.hexToArrays(hexFile);
                dataCommands = new Map();
                currentRow = aFlashInfo.programStartRow;
                startingAddress = aFlashInfo.programStartRow * aFlashInfo.addressesPerRow * aFlashInfo.addressIncrementSize;
                programAddressLength = aFlashInfo.programRowLength * aFlashInfo.addressesPerRow;
                keyIter = hexArrays.keys();
                eraseCommand = Array(3).fill(aFlashInfo.flashEraseValue);
                keyValue = keyIter.next();
                // Figure out what the closest block is
                while (keyValue.value < startingAddress) {
                    keyValue = keyIter.next();
                }
                while (!keyValue.done) {
                    currentBlock = Array.from(hexArrays.get(keyValue.value));
                    commandArray = [];
                    fillValue = (keyValue.value - startingAddress) / aFlashInfo.addressIncrementSize / 2;
                    commandArray = commandArray.concat(Array(fillValue).fill(eraseCommand));
                    // Next, we'll turn our big block of binary into an array of 3 byte
                    // commands. Due to the intel hex packer assuming 32-bit addresses (and the
                    // pic24 architecture is crazy pants), every 4th byte is a zero, which we'll
                    // need to remove, so we splice, then pop.
                    while (currentBlock.length) {
                        commandArray.push(currentBlock.splice(0, 3));
                        if (currentBlock.shift() !== 0x00) {
                            throw new Error("Trying to trim a non-zero value from hex data!");
                        }
                    }
                    commandLimit = (aFlashInfo.addressesPerRow / 2);
                    commandsPerRowCommand = 6;
                    while (commandArray.length > 0) {
                        lineCounter = 0;
                        toggle = 0x0;
                        commandsRead = 0;
                        rowCommands = [];
                        while (commandsRead < commandLimit) {
                            dataCommand = [];
                            if (commandsRead + commandsPerRowCommand < commandLimit) {
                                dataCommand = flatten(commandArray.splice(0, commandsPerRowCommand));
                                commandsRead += commandsPerRowCommand;
                            }
                            else {
                                // If we've hit the row end, fill as much as we can then append null commands.
                                dataCommand = flatten(commandArray.splice(0, commandLimit - commandsRead));
                                // Paste some null commands on to the end to fill things out.
                                dataCommand = dataCommand.concat(flatten(Array(commandsPerRowCommand - (commandLimit - commandsRead)).fill(eraseCommand)));
                                commandsRead = commandLimit;
                            }
                            // If we have any value that doesn't equal the flash erase value, finish
                            // adding the command to our output.
                            if (dataCommand.some(function (x) { return x !== aFlashInfo.flashEraseValue; })) {
                                // Attach the counter to the front of the line
                                dataCommand.unshift(toggle | lineCounter);
                                // Save it to our command array
                                rowCommands.push(dataCommand);
                                // Switch the toggle only if we're writing.
                                toggle ^= 0x80;
                            }
                            // Always increment our line counter, as it serves as the write offset
                            // into our current row.
                            lineCounter += 1;
                        }
                        currentRow += 1;
                    }
                    keyValue = keyIter.next();
                }
                return [2 /*return*/];
        }
    });
}); };
var firmwareTest = function () { return __awaiter(_this, void 0, void 0, function () {
    var d, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log("Finding Launch");
                d = new bluetooth_1.LaunchBluetooth();
                return [4 /*yield*/, d.findLaunch()];
            case 1:
                _c.sent();
                console.log("Found Launch");
                return [4 /*yield*/, d.Initialize()];
            case 2:
                _c.sent();
                return [4 /*yield*/, d.GetExecutionMode()];
            case 3:
                _c.sent();
                return [4 /*yield*/, d.GetVersion()];
            case 4:
                _c.sent();
                _b = (_a = console).log;
                return [4 /*yield*/, d.GetFlashInfo()];
            case 5:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); };
//firmwareTest();
firmwareFileTest().then(function () { process.exit(0); }).catch(function (e) { console.log(e); process.exit(0); });
//# sourceMappingURL=index.js.map