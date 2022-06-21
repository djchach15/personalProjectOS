const fetch = require('node-fetch');
export const getOffers = async (token_ID:number, collection_address:any, os_api_key:any) => {
    var offerdata:any;
    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': os_api_key}
    };


    for (var retries = 0;; retries++) {
        try {
            await fetch('https://api.opensea.io/api/v1/asset/'+collection_address+'/'+token_ID+'/offers?limit=20', options)
            .then((response: { json: () => any; }) => response.json())
            .then((data: any) => {
                offerdata = data;
            })
            .catch((err: any) => console.error(err));

            if (!offerdata.offers[0] == false) {
                return ((offerdata.offers[0].current_price)/1000000000000000000); // put it in 4 digits
            } else if (!offerdata.offers[0] == true) {
                return (0);
            }
        } catch (error:any) {
            if (retries < 3) {
                continue;
            } else {
                console.log("getOffers - " + error.message);
                return (0);
            }
        }
    }
}