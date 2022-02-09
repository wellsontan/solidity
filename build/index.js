"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var deploy_1 = require("./deploy");
var listen_1 = require("./listen");
var load_1 = require("./load");
var send_1 = require("./send");
var DB = __importStar(require("./db.api"));
var fs = require('fs');
var crypto = require('crypto');
var readline = require('readline');
function initializeProvider() {
    try {
        var provider_data = fs.readFileSync('eth_providers/providers.json');
        var provider_json = JSON.parse(provider_data);
        var provider_link = provider_json["provider_link"];
        return new web3_1.default.providers.WebsocketProvider(provider_link);
    }
    catch (error) {
        throw "Cannot read provider";
    }
}
function getAccount(web3, name) {
    try {
        var account_data = fs.readFileSync('eth_accounts/accounts.json');
        var account_json = JSON.parse(account_data);
        var account_pri_key = account_json[name]["pri_key"];
        return web3.eth.accounts.wallet.add('0x' + account_pri_key);
    }
    catch (error) {
        throw "Cannot read account";
    }
}
var shellArgs = process.argv.slice(2);
if (shellArgs.length < 1) {
    console.error("node programName cmd, e.g. node index.js deploy");
    process.exit(1);
}
(function run() {
    return __awaiter(this, void 0, void 0, function () {
        var web3Provider, web3, cmd0, account, loaded, contract, err_1, oracleAddr, account, loaded, contract, err_2, oracleAddr, account, loaded, contract, err_3, account_1, contract_1, loaded, contractAddr_1, contractAddr, contractAddr2, rl, account1_1, account2, contract_2, contract2_1, farmer_1, name_1, type_1, location_1, certifier_1, product_1, price_1, tier_1, expiry_date_1, start_date_1, produceInfo_1, jID, hax_1, loaded, userInput, product, farmer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        web3Provider = new web3_1.default.providers.WebsocketProvider("ws://localhost:7545");
                        web3 = new web3_1.default(web3Provider);
                    }
                    catch (e) {
                        throw "web3 cannot be initialized";
                    }
                    cmd0 = shellArgs[0];
                    if (!(cmd0 == "deploy")) return [3 /*break*/, 17];
                    if (shellArgs.length < 2) {
                        console.error("e.g. node index.js deploy oracle");
                        process.exit(1);
                    }
                    if (!(shellArgs[1] == "oracle")) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    account = getAccount(web3, "trusted_server");
                    loaded = load_1.loadCompiledSols(["supplyChainOracle"]);
                    return [4 /*yield*/, deploy_1.deployContract(web3, account, loaded.contracts["supplyChainOracle"]["SupplyOracle"].abi, loaded.contracts["supplyChainOracle"]["SupplyOracle"].evm.bytecode.object, [account.address])];
                case 2:
                    contract = _a.sent();
                    console.log("oracle contract address: " + contract.options.address);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("error deploying contract");
                    console.error(err_1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 16];
                case 5:
                    if (!(shellArgs[1] == "beefsc")) return [3 /*break*/, 11];
                    if (!(shellArgs.length <= 2)) return [3 /*break*/, 6];
                    console.error("node index.js deploy beefsc 0x3455566");
                    return [3 /*break*/, 10];
                case 6:
                    oracleAddr = shellArgs[2];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    account = getAccount(web3, "trusted_server");
                    loaded = load_1.loadCompiledSols(["supplyChainOracle", "BeefSupplyChain"]);
                    return [4 /*yield*/, deploy_1.deployContract(web3, account, loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].abi, loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].evm.bytecode.object, [oracleAddr])];
                case 8:
                    contract = _a.sent();
                    console.log("user app contract address: " + contract.options.address);
                    return [3 /*break*/, 10];
                case 9:
                    err_2 = _a.sent();
                    console.error("error deploying contract");
                    console.error(err_2);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 16];
                case 11:
                    if (!(shellArgs[1] == "beefsign")) return [3 /*break*/, 16];
                    if (!(shellArgs.length <= 2)) return [3 /*break*/, 12];
                    console.error("node index.js deploy beefsign 0x3455566");
                    return [3 /*break*/, 16];
                case 12:
                    oracleAddr = shellArgs[2];
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    account = getAccount(web3, "trusted_server");
                    loaded = load_1.loadCompiledSols(["supplyChainOracle", "BeefCertification"]);
                    return [4 /*yield*/, deploy_1.deployContract(web3, account, loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].abi, loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].evm.bytecode.object, [oracleAddr])];
                case 14:
                    contract = _a.sent();
                    console.log("beef sign contract address: " + contract.options.address);
                    return [3 /*break*/, 16];
                case 15:
                    err_3 = _a.sent();
                    console.error("error deploying contract");
                    console.error(err_3);
                    return [3 /*break*/, 16];
                case 16:
                    web3Provider.disconnect(1000, 'Normal Closure');
                    return [3 /*break*/, 18];
                case 17:
                    if (cmd0 == "listen") {
                        if (shellArgs.length < 3) {
                            console.error("e.g. node index.js listen oracle 0x23a01...");
                            process.exit(1);
                        }
                        if (shellArgs[1] == "oracle") {
                            try {
                                account_1 = getAccount(web3, "trusted_server");
                                loaded = load_1.loadCompiledSols(["supplyChainOracle"]);
                                contractAddr_1 = shellArgs[2];
                                console.log('contractaddr: ', contractAddr_1);
                                contract_1 = new web3.eth.Contract(loaded.contracts["supplyChainOracle"]["SupplyOracle"].abi, contractAddr_1, {});
                            }
                            catch (err) {
                                console.error("error listening oracle contract");
                                console.error(err);
                            }
                            listen_1.handleRequestEvent(contract_1, function (caller, requestId, data) { return __awaiter(_this, void 0, void 0, function () {
                                var output, receipt;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            output = crypto.randomBytes(4).readUInt32BE(0, true);
                                            console.log("Received event", requestId, caller, output);
                                            console.log("requestID: ", requestId);
                                            console.log("caller: ", caller);
                                            console.log("output: ", output);
                                            return [4 /*yield*/, send_1.methodSend(web3, account_1, contract_1.options.jsonInterface, "replyData(uint256,address,uint256)", contract_1.options.address, [requestId, caller, output])];
                                        case 1:
                                            receipt = _a.sent();
                                            console.log(receipt);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                    }
                    else if (cmd0 == "client") {
                        contractAddr = shellArgs[1];
                        contractAddr2 = shellArgs[2];
                        rl = readline.createInterface(process.stdin, process.stdout);
                        account2 = void 0;
                        jID = void 0;
                        try {
                            account1_1 = getAccount(web3, "trusted_server");
                            account2 = getAccount(web3, "user");
                            loaded = load_1.loadCompiledSols(["BeefSupplyChain", "BeefCertification"]);
                            contract_2 = new web3.eth.Contract(loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].abi, contractAddr, {});
                            contract2_1 = new web3.eth.Contract(loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].abi, contractAddr2, {});
                        }
                        catch (err) {
                            console.error("error setting up client");
                            console.error(err);
                        }
                        userInput = function () {
                            rl.question('input commands\n', function (command) {
                                if (command == "exit") {
                                    process.exit(0);
                                    // Add user to db and blockchain
                                }
                                else if (command == "user") {
                                    // Sample data
                                    var sha256File = require('sha256-file');
                                    hax_1 = sha256File('./sample_data/pdf/food_certificate.pdf');
                                    farmer_1 = getAccount(web3, "FARMER").address;
                                    name_1 = "RanchFarm AU";
                                    type_1 = 0;
                                    location_1 = "Sydney, NSW";
                                    certifier_1 = getAccount(web3, "certifier").address;
                                    console.log("Sending new user request to smart contract...\n");
                                    // Add to blockchain
                                    contract_2.methods.registerUser(farmer_1, name_1, location_1, type_1).send({ from: account1_1.address, gas: 1000000, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                    // Add to database
                                    DB.add_user(farmer_1, name_1, "FARMER", location_1, certifier_1, hax_1);
                                    // Add certifier to blockchain
                                }
                                else if (command == "certifier") {
                                    console.log("Sending new certifier request to beef sign contract...\n");
                                    contract2_1.methods.addCertifier(certifier_1, "John", "Food Safety Department").send({ from: account1_1.address, gas: 150000, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                    // Add product to db and blockchain
                                }
                                else if (command == "produce") {
                                    // Sample data
                                    product_1 = "BEEF01";
                                    price_1 = "150AUD";
                                    tier_1 = "A5";
                                    expiry_date_1 = "02-08-2021";
                                    console.log("Sending Produce Beef request to smart contract...\n");
                                    // Add to blockchain
                                    contract_2.methods.addBeefProduce(product_1, "Wagyu A5").send({ from: farmer_1, gas: 159899, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                    // Add to database
                                    DB.add_beef(product_1, farmer_1, price_1, tier_1, expiry_date_1);
                                    // Add journey to db and blockchain
                                }
                                else if (command == "journey") {
                                    // Sample data
                                    start_date_1 = 20210729;
                                    produceInfo_1 = "produced in RanchFarm AU";
                                    console.log("Sending Journey update to smart contract...\n");
                                    // Add to blockchain
                                    contract_2.methods.createJourney(product_1, start_date_1, produceInfo_1).send({ from: farmer_1, gas: 559899, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                    // Add to database
                                    DB.add_journey(product_1, farmer_1, "produced in RanchFarm AU");
                                    // create a signature for certifier on blockchain
                                }
                                else if (command == "create_sign") {
                                    contract2_1.methods.createSign(20210729, "organicCertification", "inspected by: John").send({ from: certifier_1, gas: 1559899, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                    // let certifier sign a beef product on blockchain
                                }
                                else if (command == "sign_beef") {
                                    contract2_1.methods.signBeefProduct(product_1, hax_1).send({ from: certifier_1, gas: 959899, gasPrice: 20000000000 }).then(function (receipt) {
                                        console.log(receipt);
                                    });
                                }
                                userInput();
                            });
                        };
                        userInput();
                    }
                    else if (cmd0 == "db") {
                        product = "BEEF01";
                        farmer = getAccount(web3, "FARMER").address;
                        DB.get_function('user');
                        DB.get_function('beef', product);
                        DB.get_function("journey", product);
                        DB.finish_journey(product, farmer);
                        DB.get_function("journey", product);
                    }
                    _a.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
})();
