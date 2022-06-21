import { biddingBot } from "./components/biddingBot";
const reader = require("readline-sync");
import { getOfferDetails_20, profitDetails, rankProfitDetails } from "./components/offerDetails";
import { getCollectionDetails } from "./components/collectionDetails";
import { offerSnipe } from "./components/offerSnipe";
import { rarityBiddingBot } from "./components/rarityBiddingBot";
const {TextDecoder, TextEncoder} = require("util");

const os_api_key_one:any = '';
const os_api_key_two:any = '';
const os_api_key_three:any = '';
const os_api_key_four:any = '';

const arr_OSAPIKEYS:any = [os_api_key_one, os_api_key_two, os_api_key_three, os_api_key_four];

const provider_url_one:any = '';
const provider_url_two:any = '';
const provider_url_three:any = '';
const provider_url_four:any = '';

const arr_PROVIDERURL:any = [provider_url_one, provider_url_two, provider_url_three, provider_url_four];

const wallet_priv_key:any = '';
const mnemonic_phrase_var:any = '';
const wallet_address:any = '';

const getNumOfCollections = async () => { 
    var selection = reader.question("How many collections would you like to bid on? (Max: 4) ");
    switch(selection) {
        case '1':
            return(1);
        case '2':
            return(2);
        case '3':
            return(3);
        case '4':
            return(4);
        default:
            return(1);
    }
}

const getContractAddress = async (num_of_collections_selected:any) => {
    switch(num_of_collections_selected) {
        case 1:
            var selection1 = reader.question("Enter first collection contract address - ");
            return{selection1};
        case 2:
            var selection1 = reader.question("Enter first collection contract address - ");
            var selection2 = reader.question("Enter second collection contract address - ");
            return{selection1, selection2};
        case 3:
            var selection1 = reader.question("Enter first collection contract address - ");
            var selection2 = reader.question("Enter second collection contract address - ");
            var selection3 = reader.question("Enter third collection contract address - ");
            return{selection1, selection2, selection3};
        case 4:
            var selection1 = reader.question("Enter first collection contract address - ");
            var selection2 = reader.question("Enter second collection contract address - ");
            var selection3 = reader.question("Enter third collection contract address - ");
            var selection4 = reader.question("Enter fourth collection contract address - ");
            return{selection1, selection2, selection3, selection4};
    }
}

const getBiddingDetails = async (botSelection:number) => {
    var arr_offerDetails:any = [];
    var arr_address:any = [];
    var arr_collectionDetails:any = [];
    var totalOffer:number = 0;

    var newCollection = true;
    var i:number = 0;
    var apiNum:number = 0;

    while (newCollection == true) {
        var q_collAddr = reader.question("Enter collection contract address - ");
        arr_address.push(q_collAddr);
        
        console.log("");

        var collectionDetails:any = await getCollectionDetails(arr_address[i], arr_OSAPIKEYS[apiNum]);
        console.log(`
            Collection Name - ${collectionDetails?.collectionName}
            Collection Floor - ${collectionDetails?.collectionFloor}
            Collection Supply - ${collectionDetails?.collectionCount}
            Collection Royalty - ${collectionDetails?.collectionSellerFee}
            75% Bid - ${collectionDetails?.collectionFloor * 0.75}
            `)
        arr_collectionDetails.push(collectionDetails);

        console.log("");

        var q_bidAmt:number = reader.question(`Enter bid amount for ${collectionDetails?.collectionName} - `);
        var q_maxAmt:number = reader.question(`Enter max bid amount for ${collectionDetails?.collectionName} - `);
        console.log("");
        if(botSelection == 1){
            var offerDetails:any = await profitDetails(q_bidAmt, q_maxAmt, collectionDetails?.collectionFloor, collectionDetails?.collectionSellerFee, collectionDetails?.collectionOpenseaFee);
            arr_offerDetails.push(offerDetails);
        }
        if(botSelection == 2){
            var offerDetails:any = await rankProfitDetails(q_bidAmt, q_maxAmt, collectionDetails?.collectionFloor, collectionDetails?.collectionSellerFee, collectionDetails?.collectionOpenseaFee);
            arr_offerDetails.push(offerDetails);
        }

        console.log("");

        totalOffer = totalOffer + (offerDetails.selectedMaxOffer * 550);
        console.log(`Total Offer - ${totalOffer}`);

        console.log("");

        var q_continue = reader.question("Would you like to add another collection? (y/n) ");
        if(q_continue == 'y') {
            console.log('yes');
            i = i +1;
            apiNum = apiNum +1;
            if (apiNum == 4) {apiNum = 0};
        }
        if(q_continue == 'n') {
            console.log('no');
            newCollection = false;
        }
    };
    var bidNum:number = 0;
    apiNum = 0;
    while (bidNum < arr_address.length) {
        if(botSelection == 1){
            biddingBot(
                arr_collectionDetails[bidNum].collectionName,
                arr_collectionDetails[bidNum].collectionSchema,
                arr_address[bidNum],
                arr_offerDetails[bidNum].startPosition,
                arr_offerDetails[bidNum].endPosition,
                arr_offerDetails[bidNum].selectedOffer,
                arr_offerDetails[bidNum].selectedMaxOffer, 
                wallet_address, 
                mnemonic_phrase_var, 
                arr_OSAPIKEYS[apiNum],
                arr_PROVIDERURL[apiNum]
            );
        }
        if(botSelection == 2){
            rarityBiddingBot(
                arr_collectionDetails[bidNum].collectionName,
                arr_collectionDetails[bidNum].collectionSchema,
                arr_address[bidNum],
                arr_offerDetails[bidNum].startPosition,
                arr_offerDetails[bidNum].endPosition,
                arr_offerDetails[bidNum].selectedOffer,
                arr_offerDetails[bidNum].selectedMaxOffer, 
                wallet_address, 
                mnemonic_phrase_var, 
                arr_OSAPIKEYS[apiNum],
                arr_PROVIDERURL[apiNum],
                arr_offerDetails[bidNum].gobGrlzArr,
            );
        }
        timer(2000);
        bidNum = bidNum + 1;
        apiNum = apiNum + 1;
        if (apiNum == 4) {apiNum = 0};
    }
}

const timer = (ms:any) => new Promise((res) => setTimeout(res, ms));

const main = async () => {

    console.log('***** Select Bot *****')
    var botSelection:number = reader.question("What bot would you like to use (1 for MASS BIDDING or 2 for RARITY BIDDING ): ");

    getBiddingDetails(botSelection);
}

main()

