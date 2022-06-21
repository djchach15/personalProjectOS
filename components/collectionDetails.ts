const fetch = require('node-fetch');

export const getCollectionDetails = async (collection_address: string, os_api_key: any) => {
    var collectionSlug: any;
    var collectionCount: any;
    var collectionFloor: any;
    var collectionName: any;
    var collectionSellerFee: number;
    var collectionOpenseaFee: number
    var collectionSchema: any;

    const contracts_options = {method: 'GET', headers: {'X-API-KEY': os_api_key}};
    var contractData:any;

    for (var retries = 0;; retries++) {
        try {
            await fetch('https://api.opensea.io/api/v1/asset_contract/'+collection_address, contracts_options)
            .then((response: { json: () => any; }) => response.json())
            .then((data: any) => {
                contractData = data;
            })
            .catch((err: any) => console.error(err));

            var slug = contractData.collection.slug;

            const options = {method: 'GET'};
            var collectionData:any;
            await fetch('https://api.opensea.io/api/v1/collection/'+slug, options)
                .then((response: { json: () => any; }) => response.json())
                .then((data: any) => {
                    collectionData = data;
                })
                .catch((err: any) => console.error(err));

            
            collectionName = collectionData.collection.name;
            collectionCount = collectionData.collection.stats.count;
            collectionFloor = collectionData.collection.stats.floor_price;
            collectionSlug = collectionData.collection.slug;
            collectionSchema = collectionData.collection.primary_asset_contracts[0].schema_name;
            collectionSellerFee = collectionData.collection.dev_seller_fee_basis_points/10000;
            collectionOpenseaFee = collectionData.collection.opensea_seller_fee_basis_points/10000;

            return {collectionName, collectionCount, collectionFloor, collectionSlug, collectionSellerFee, collectionOpenseaFee, collectionSchema};
        } catch (error:any) {
            if (retries < 3) {
                continue;
            } else {
                console.log("getCollectionDetails - " + error.message);
            }
        }
    }
}