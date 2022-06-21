import { getFloor } from "./getFloor";
import { getOffers } from "./getOffers";
import { OpenSeaPort } from 'opensea-js';
import { Network } from 'opensea-js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { WyvernSchemaName } from "opensea-js/lib/types";
const {TextDecoder, TextEncoder} = require("util");
const reader = require("readline-sync");
const fetch = require('node-fetch');

export async function biddingBot(collectionName:any, collectionSchema:any, collection_address:any, tokenIDStart:any, collectionCount:any, defaultOffer_var:number, maxOffer_var:number, wallet_address: any, mnemonic_phrase_var: any, os_api_key:any, provider_url:any) {
    // Setup Info
    const provider = new HDWalletProvider({
        mnemonic: mnemonic_phrase_var,
        providerOrUrl: provider_url,
        addressIndex: 0
    });

    const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main,
    apiKey: os_api_key
    });
    
    // Get Floor Price
    var intFloorPrice:number = await getFloor(collection_address, os_api_key);
    var DynFloorPrice:any;
    var adjFloorPrice:any;
    var beatOffer_var:any = 0.0001;
    var bidDuration_var:any = 15;

    // Offer Details
    var DynDefaultOffer:number = defaultOffer_var;
    var DynMaxOffer:number = maxOffer_var;

    console.log("Floor price here - " + intFloorPrice)
    console.log("Default offer here - " +DynDefaultOffer);
    console.log("Default max here - " +DynMaxOffer);

    for (let token_ID = tokenIDStart; token_ID < collectionCount; token_ID++) {
        // Determine highest offer of each asset
        var highestOffer = await getOffers(token_ID, collection_address, os_api_key);

        if (token_ID % 15 == 0) {
            DynFloorPrice = await getFloor(collection_address, os_api_key);
            adjFloorPrice = ( 1-((intFloorPrice-DynFloorPrice)/intFloorPrice) )
            DynDefaultOffer = defaultOffer_var*adjFloorPrice;
            DynMaxOffer = maxOffer_var*adjFloorPrice;
            console.log(collectionName);
            console.log("New floor price = " + DynFloorPrice)
            console.log("New default offer = " +DynDefaultOffer);
            console.log("New default max = " +DynMaxOffer);
        }

        // Offer
        try {
            var biddingAmount = DynDefaultOffer;
            if (((highestOffer+beatOffer_var) < DynMaxOffer) && ((highestOffer >= DynDefaultOffer))) {
                biddingAmount = highestOffer+beatOffer_var;
            } else if (((highestOffer+beatOffer_var) < DynMaxOffer) && ((highestOffer < DynDefaultOffer))) {
                biddingAmount = DynDefaultOffer;
            } else if ((highestOffer+beatOffer_var) > DynMaxOffer) {
                biddingAmount = DynDefaultOffer;
            }
            if (collectionSchema == "ERC1155") {
                const offer = await seaport.createBuyOrder({
                    asset: {
                        tokenAddress: collection_address,
                        tokenId: token_ID.toString(),
                        schemaName: WyvernSchemaName.ERC1155
                    },
                    accountAddress: wallet_address,
                    startAmount: biddingAmount,
                    expirationTime: Math.round(Date.now() / 1000 + bidDuration_var * 60)
                })
            } else {
                const offer = await seaport.createBuyOrder({
                    asset: {
                        tokenAddress: collection_address,
                        tokenId: token_ID.toString(),
                    },
                    accountAddress: wallet_address,
                    startAmount: biddingAmount,
                    expirationTime: Math.round(Date.now() / 1000 + bidDuration_var * 60)
                })
            }
            console.log(collectionName + ' Bid ' + biddingAmount + ' ETH on ' + token_ID + ' which had an offer of ' + highestOffer);
            console.log("");
        } catch (error:any) {
            console.log('MakeDynamicError_One: ' + error.message);
            if (error.message == "API Error 404: Not found. Full message was '{\"success\":false}'") {
                continue;
            }
        }

        if (token_ID == (collectionCount-20)) {
            token_ID = tokenIDStart;
            console.log('restarting bidding');
        }
    }
}