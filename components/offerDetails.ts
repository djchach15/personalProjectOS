const reader = require("readline-sync");

export const getOfferDetails = async (collectionFloor: any, sellerFee: any, osFee: any) => {
    var gas_fee:number = 0.02;
    var low_pct:number = 0.35;
    var avg_pct:number = 0.25;
    var agrsv_pct:number = 0.20;
    var max_pct:number = 0.16;

    var floor_after_fees:number = ( collectionFloor - (collectionFloor * sellerFee) - (collectionFloor * osFee) - gas_fee);

    var low_offer:any = ( collectionFloor * (1-low_pct) ).toFixed(5);
    var low_profit:any = ( floor_after_fees - low_offer ).toFixed(5);

    var avg_offer:any = ( collectionFloor * (1-avg_pct) ).toFixed(5);
    var avg_profit:any = ( floor_after_fees - avg_offer ).toFixed(5);

    var agrsv_offer:any = ( collectionFloor * (1-agrsv_pct) ).toFixed(5);
    var agrsv_profit:any = ( floor_after_fees - agrsv_offer ).toFixed(5);

    var max_offer:any = ( collectionFloor * (1-max_pct) ).toFixed(5);

    return { low_offer, low_profit, avg_offer, avg_profit, agrsv_offer, agrsv_profit, max_offer }
}

export const getOfferDetails_20 = async (collectionFloor: number, sellerFee: number, osFee: number) => {
    var gas_fee:number = 0.02;
    var offer_pct:number = 0.25;
    var max_pct:number = 0.16;

    var floor_after_fees:number = ( collectionFloor - (collectionFloor * sellerFee) - (collectionFloor * osFee) - gas_fee);

    var offer:number = ( collectionFloor * (1-offer_pct) );
    var profit:number = ( floor_after_fees - offer );

    var max_offer:number = ( collectionFloor * (1-max_pct) );

    return {offer, profit, max_offer}
}

export const profitDetails = async (selectedOffer:number, selectedMaxOffer:number, collectionFloor: number, sellerFee: number, osFee: number) => {
    var gas_fee:number = 0.02;

    var floor_after_fees:number = ( collectionFloor - (collectionFloor * sellerFee) - (collectionFloor * osFee) - gas_fee);

    var profit:number = ( floor_after_fees - selectedOffer );

    console.log(`Offer: ${selectedOffer} / Max Offer: ${selectedMaxOffer} / Est. Profit: ${profit}`);

    var startPosition:number = reader.question("Enter start position - ");
    var endPosition:number = reader.question("Enter end position - ");

    return {selectedOffer, selectedMaxOffer, profit, startPosition, endPosition};

}

export const rankProfitDetails = async (selectedOffer:number, selectedMaxOffer:number, collectionFloor: number, sellerFee: number, osFee: number) => {
    var gas_fee:number = 0.02;

    var floor_after_fees:number = ( collectionFloor - (collectionFloor * sellerFee) - (collectionFloor * osFee) - gas_fee);

    var profit:number = ( floor_after_fees - selectedOffer );

    console.log(`Offer: ${selectedOffer} / Max Offer: ${selectedMaxOffer} / Est. Profit: ${profit}`);

    var gobGrlzArr:any = [
    ]; // TokenIDs here

    var startPosition:number = 0
    var endPosition:number = gobGrlzArr.length - 1;

    return {selectedOffer, selectedMaxOffer, profit, startPosition, endPosition, gobGrlzArr};

}