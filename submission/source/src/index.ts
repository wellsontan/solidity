import Web3 from 'web3';
import { WebsocketProvider, Account } from 'web3-core';
import { deployContract } from './deploy';
import { handleRequestEvent, handleRequestEventBeef } from './listen';
import { loadCompiledSols } from './load';
import { methodSend } from './send';
import { Contract } from 'web3-eth-contract';
import * as DB from './db.api';
import { cpuUsage, exit } from 'process';

let fs = require('fs');
let crypto = require('crypto');

let readline = require('readline');
function initializeProvider(): WebsocketProvider {
    try {
        let provider_data = fs.readFileSync('eth_providers/providers.json');
        let provider_json = JSON.parse(provider_data);
        let provider_link = provider_json["provider_link"];
        return new Web3.providers.WebsocketProvider(provider_link);
    } catch (error) {
        throw "Cannot read provider";
    }
}

function getAccount(web3: Web3, name: string): Account {
    try {
        let account_data = fs.readFileSync('eth_accounts/accounts.json');
        let account_json = JSON.parse(account_data);
        let account_pri_key = account_json[name]["pri_key"];
        return web3.eth.accounts.wallet.add('0x' + account_pri_key);
    } catch (error) {
        throw "Cannot read account";
    }
}

var shellArgs = process.argv.slice(2);
if (shellArgs.length < 1) {
    console.error("node programName cmd, e.g. node index.js deploy");
    process.exit(1);
}

(async function run() {
    let web3Provider!: WebsocketProvider;
    let web3!: Web3;
    try {
        web3Provider = new Web3.providers.WebsocketProvider("ws://localhost:7545");
        web3 = new Web3(web3Provider);
    } catch (e) {
        throw "web3 cannot be initialized";
    }

    var cmd0 = shellArgs[0];

    if (cmd0 == "deploy") {
        if (shellArgs.length < 2) {
            console.error("e.g. node index.js deploy oracle");
            process.exit(1);
        }
        if (shellArgs[1] == "oracle") {
            try {
                let account = getAccount(web3, "trusted_server");
                let loaded = loadCompiledSols(["supplyChainOracle"]);
                //console.log(loaded);
                let contract = await deployContract(web3!, account, loaded.contracts["supplyChainOracle"]["SupplyOracle"].abi, loaded.contracts["supplyChainOracle"]["SupplyOracle"].evm.bytecode.object, [account.address]);
                console.log("oracle contract address: " + contract.options.address);
            } catch (err) {
                console.error("error deploying contract");
                console.error(err);
            }
        } else if (shellArgs[1] == "beefsc") {
            if (shellArgs.length <= 2) {
                console.error("node index.js deploy beefsc 0x3455566");
            } else {
                let oracleAddr = shellArgs[2];
                try {
                    let account = getAccount(web3, "trusted_server");
                    let loaded = loadCompiledSols(["supplyChainOracle", "BeefSupplyChain"]);
                    let contract = await deployContract(web3!, account, loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].abi, loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].evm.bytecode.object, [oracleAddr]);
                    console.log("user app contract address: " + contract.options.address);
                } catch (err) {
                    console.error("error deploying contract");
                    console.error(err);
                }
            }
        } else if (shellArgs[1] == "beefsign") {
            if (shellArgs.length <= 2) {
                console.error("node index.js deploy beefsign 0x3455566");
            } else {
                let oracleAddr = shellArgs[2];
                try {
                    let account = getAccount(web3, "trusted_server");
                    let loaded = loadCompiledSols(["supplyChainOracle", "BeefCertification"]);
                    let contract = await deployContract(web3!, account, loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].abi, loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].evm.bytecode.object, [oracleAddr]);
                    console.log("beef sign contract address: " + contract.options.address);
                } catch (err) {
                    console.error("error deploying contract");
                    console.error(err);
                }
            }
        }
        web3Provider.disconnect(1000, 'Normal Closure');
    } else if (cmd0 == "listen") {
        if (shellArgs.length < 3) {
            console.error("e.g. node index.js listen oracle 0x23a01...");
            process.exit(1);
        }
        if (shellArgs[1] == "oracle") {
            let account!: Account;
            let contract!: Contract;
            try {
                account = getAccount(web3, "trusted_server");
                let loaded = loadCompiledSols(["supplyChainOracle"]);
                let contractAddr = shellArgs[2];
                console.log('contractaddr: ', contractAddr);
                contract = new web3.eth.Contract(loaded.contracts["supplyChainOracle"]["SupplyOracle"].abi, contractAddr, {});
            } catch (err) {
                console.error("error listening oracle contract");
                console.error(err);
            }
            handleRequestEvent(contract, async (caller: String, requestId: Number, data: any) => {

                let output = crypto.randomBytes(4).readUInt32BE(0, true);
                console.log("Received event", requestId, caller, output);

                console.log("requestID: ", requestId);
                console.log("caller: ", caller);
                console.log("output: ", output);
                let receipt = await methodSend(web3, account, contract.options.jsonInterface, "replyData(uint256,address,uint256)", contract.options.address, [requestId, caller, output]);
                console.log(receipt);
            });
            
        }
    } else if (cmd0 == "client") {
        var contractAddr = shellArgs[1];
        var contractAddr2 = shellArgs[2];
        var rl = readline.createInterface(process.stdin, process.stdout);
        let account1!: Account;
        let account2!: Account;
        let contract!: Contract;
        let contract2!: Contract;

        // Pre-defined variables for later use
        let farmer!: string;
        let name!: string;
        let type!: number;
        let location!: string;
        let certifier!: string;
        let product!: string;
        let price!: string;
        let tier!: string;
        let expiry_date!: string;
        let start_date!: number;
        let produceInfo!: string;
        let jID!: string;
        let hax!: string;

        try {
            account1 = getAccount(web3, "trusted_server"); 
            account2 = getAccount(web3, "user"); 
            let loaded = loadCompiledSols(["BeefSupplyChain", "BeefCertification"]);
            contract = new web3.eth.Contract(loaded.contracts["BeefSupplyChain"]["Hotpot_BeefSC"].abi, contractAddr, {});
            contract2 = new web3.eth.Contract(loaded.contracts["BeefCertification"]["Hotpot_BeefSign"].abi, contractAddr2, {});
        } catch (err) {
            console.error("error setting up client");
            console.error(err);
        }
        var userInput = function () {
            rl.question('input commands\n', (command:string) => {
                if (command == "exit") {
                    process.exit(0);

                // Add user to db and blockchain
                } else if (command == "user") {
                    // Sample data
                    var sha256File = require('sha256-file');
                    hax = sha256File('./sample_data/pdf/food_certificate.pdf');
                    farmer = getAccount(web3, "FARMER").address;
                    name = "RanchFarm AU";
                    type = 0;
                    location = "Sydney, NSW";
                    certifier = getAccount(web3, "certifier").address;

                    console.log("Sending new user request to smart contract...\n");
                    // Add to blockchain
                    contract.methods.registerUser(farmer, name, location, type).send({from: account1.address, gas: 1000000, gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })
                    // Add to database
                    DB.add_user(farmer, name, "FARMER", location, certifier, hax);
                
                // Add certifier to blockchain
                } else if (command == "certifier") {
                    console.log("Sending new certifier request to beef sign contract...\n");
                    contract2.methods.addCertifier(certifier, "John", "Food Safety Department").send({from: account1.address, gas: 150000 , gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })

                // Add product to db and blockchain
                } else if (command == "produce") {
                    // Sample data
                    product = "BEEF01";
                    price = "150AUD";
                    tier = "A5";
                    expiry_date = "02-08-2021";

                    console.log("Sending Produce Beef request to smart contract...\n");
                    // Add to blockchain
                    contract.methods.addBeefProduce(product, "Wagyu A5").send({from: farmer, gas: 159899, gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })

                    // Add to database
                    DB.add_beef(product, farmer, price, tier, expiry_date);

                // Add journey to db and blockchain
                } else if (command == "journey") {
                    // Sample data
                    start_date = 20210729;
                    produceInfo ="produced in RanchFarm AU";            

                    console.log("Sending Journey update to smart contract...\n");
                    // Add to blockchain
                    contract.methods.createJourney(product, start_date, produceInfo).send({from: farmer, gas: 559899, gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })

                    // Add to database
                    DB.add_journey(product, farmer, "produced in RanchFarm AU");
                
                // create a signature for certifier on blockchain
                } else if (command == "create_sign") {
                    contract2.methods.createSign(20210729, "organicCertification", "inspected by: John").send({from: certifier, gas: 1559899, gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })

                // let certifier sign a beef product on blockchain
                } else if (command == "sign_beef") {
                    contract2.methods.signBeefProduct(product, hax).send({from: certifier, gas: 959899, gasPrice: 20000000000}).then(function (receipt:any) {
                        console.log(receipt);
                    })
                }
                userInput();
            });
        }
        userInput();
    } else if (cmd0 == "db") {
        // For checking the information in database
        var product = "BEEF01";
        let farmer = getAccount(web3, "FARMER").address;
        DB.get_function('user');
        DB.get_function('beef', product);
        DB.get_function("journey", product);
        DB.finish_journey(product, farmer);
        DB.get_function("journey", product);
    }
})();
