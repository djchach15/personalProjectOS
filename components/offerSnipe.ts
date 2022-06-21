import { getFloor } from "./getFloor";
import { getOffers } from "./getOffers";

// Telegram
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('', {polling: true})


export async function offerSnipe(collection_address:any, collectionCount:any, collectionName:any, os_api_key:any) {
    var floorPrice:number = await getFloor(collection_address, os_api_key);

    for (let token_ID = 1; token_ID < collectionCount; token_ID++) {
        var highestOffer = await getOffers(token_ID, collection_address, os_api_key);

        if (highestOffer > floorPrice) {
            bot.sendMessage(398687296, `Offer found above floor on ${collectionName} for ${token_ID}`);
        };

        if (token_ID % 15 == 0) {
            floorPrice = await getFloor(collection_address, os_api_key);
            console.log(`Floor price - ${floorPrice}`)
        }

        if (token_ID >= (collectionCount - 20)) {
            token_ID == 1;
        }
    }
}