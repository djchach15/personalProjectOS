const fetch = require('node-fetch');
export const getFloor = async (collection_address:any, os_api_key:any) => {
    var collectionFloor:any;

    for (var retries = 0;; retries++) {
        try {
            const contracts_options = {method: 'GET', headers: {'X-API-KEY': os_api_key}};
        var contractData:any;
        await fetch('https://api.opensea.io/api/v1/asset_contract/'+collection_address, contracts_options)
            .then((response: { json: () => any; }) => response.json())
            .then((data: any) => {
                contractData = data;
            })
            .catch((err: any) => console.error(err));

        var slug:any = contractData.collection.slug;

        const options = {method: 'GET'};
        var collectionData:any;
        await fetch('https://api.opensea.io/api/v1/collection/'+slug, options)
            .then((response: { json: () => any; }) => response.json())
            .then((data: any) => {
                collectionData = data;
            })
            .catch((err: any) => console.error(err));

        
        collectionFloor = collectionData.collection.stats.floor_price;
        return collectionFloor;
        } catch (error:any) {
            if (retries < 3) {
                continue;
            } else {
                console.log("getFloorError - " + error.message);
            }
        }
    }
}