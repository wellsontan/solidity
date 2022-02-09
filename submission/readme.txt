Here is the following steps to set-up the source code

cd source/

npm install

To run the source code using ganache, you will need to update the provider information and eth account information
The files that need to be updated are:

source/eth_providers/providers.json   <-- update the provider_link value, for example : "ws://0.0.0.0:7545"
source/eth_accounts/accounts.json     <-- fill in 4 accounts with their private keys


Next, you will need to run the database server before running the main code. Here are the following steps
to run the server, more details can be found in source/db_server/README.md

    cd source/db_server/

    npm install

    npm run db-init

    npm start

This will start the sqlite3 db server for our application.

If you wish to clear the entire database and get fresh empty tables run the following

    npm run db-reset

Now, we may begin running the main code.

First we compile the typescript

    cd source/
    npx tsc

Note that there are some errors when running this command, please ignore them.

To deploy 
    node build/index.js deploy oracle

    node build/index.js deploy beefsc oracle_addr (e.g. node build/index.js deploy beefsc 0x00000000000001)

    node build index.js deploy beefsign oracle_addr (e.g. node build/index.js deploy beefsign 0x00000000000001)

To set-up the off-chain listener
    node build/index.js listen oracle oracle_addr (e.g. node build/index.js listen oracle 0x00000000000001)

To run the CLI client
    node build/index.js client beefsc_addr beefsign_addr (e.g. node build/index.js client 0x00000000000002 0x00000000000003)

The smart contracts require the manager (deployer of the contract) to provide it with the
beefsc
    addCertifierContractAddr  <-- the address of the beefsign contract (Do it in Remix)
    registerUser              <-- add addresses of users (users are supply chain partipants)
beefsign
    addSuplyChainAddress      <-- the address of the beefsc contract (Do it in Remix)
    addCertifier              <-- add addresses of certifiers (users who certify beef)

The commands available are :
    user 
    certifier
    produce
    journey
    create_sign
    sign_beef
    exit or CTRL + c

After running those commands, you may check the data within the db with the following
    node build/index.js db
