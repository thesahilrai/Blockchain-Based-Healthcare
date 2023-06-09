/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')

        await contract.submitTransaction('createCar','HcTx2', 'P123', 'Raj Gupta', 'H123', '0x8b1dde419f0e373b95b99f56672768a85a264f9a38138a80e19cc50ecfe1c378');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();


























        // console.log('No. of Transaction : 500')
        // var toda1 = new Date().getTime();
        // console.log('Transaction has been Started' + ' ' + toda1);

        // for (let i = 1082; i <1582; i++) {
        //     await contract.submitTransaction('createCar','HcTx'+i, 'P123', 'Raj Gupta', 'H123', '0x8b1dde419f0e373b95b99f56672768a85a264f9a38138a80e19cc50ecfe1c378');
        //   }

        // var toda2 = new Date().getTime();
        // console.log('Transaction has been submitted' + ' ' + toda2);
        // console.log('Time Delay ' + ((toda2-toda1)/1000) + ' in secs')