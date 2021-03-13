let cron = require('node-cron');
let SpecialDeals = require('../models/specialDealIndexes');
let popularIndexes = [];
let fetch = require('node-fetch');
let featureDealNames = require('../config/featuredGameTitles');
let featuredIds = [];
let saleIndexes = [];
let globalDeals = {};

exports.dayCron = async () => {
    let task = cron.schedule('* * * */23 * *', () => {
        console.log('Here');
        getAndSetSpecialDealIndexes();
    });
    task.start();
}

let getAndSetSpecialDealIndexes = async () => {
    console.log('running a task every day');
    console.log('Getting deal length');
    let length = await getDealAndLength();
    console.log('length: ' + length);
    for(let i = 0; i < 4; i++){
        addNumber(length);
    }
    SpecialDeals.remove({}, async err => {
        if(err){
            console.error('Something wnet wrong when deleteing SpecialDealsIndexes because ' + err.message)
        }
        else{
            let featuredDeal = await createFeaturedDeal();
            SpecialDeals.create({
                featured: featuredDeal,
                popular: getPopularDealsFromIndexes()
            }, (err, specialDeals) => {
                if(err){
                    console.error('Something went wrong trying to create the special deals because ' + err.message);
                }
                else{
                    console.log('The newly created deal is below');
                    console.log(specialDeals);
                }
            });
        }
    });
}
function getPopularDealsFromIndexes(){
    let popularDeals = [];
    for(let i = 0; i < popularIndexes.length; i++){
        let popularIndex = popularIndexes[i];
        popularDeals.push(globalDeals[popularIndex]);
    }
    console.log('popularDeals below');
    console.log(popularDeals);
    return popularDeals;
}
async function createFeaturedDeal(){
    let featuredId;
    console.log('Getting get ids of featured names');
    featuredIds = await getIdsOfFeaturedNames();
    console.log('Getting ids of featured titles that are on sale');
    saleIDs = await getFeaturedIDIndexesThatAreOnSale(featuredIds);
    let featuredIndex;
    if(saleIDs.length <= 0){
        featuredId = featuredIds[Math.floor(Math.random() * (featuredIds.length - 1))];
    }
    else{
        featuredId = saleIDs[Math.floor(Math.random() * (saleIDs.length - 1))];
    }
    featuredIndex = featuredIds.indexOf(featuredId);
    console.log('Getting deal from selected id');
    let featuredDeal = await getDealFromId(featuredId);
    featuredDeal.picture = `https://serene-williams-bb8bee.netlify.app/images/FeaturedThumbnails/${featureDealNames[featuredIndex]}.png`;
    featuredDeal.dealID = featuredId;
    return featuredDeal;
}

async function getIdsOfFeaturedNames(){
    featuredIds = [];
    for(let i = 0; i < featureDealNames.length; i++){
        let featuredDealName = featureDealNames[i]
        let dealId;
        let data = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${featuredDealName}`);
        let deal = await data.json();
        featuredIds.push(deal[0].cheapestDealID);
    }
    return(featuredIds);
}

async function getDealFromId(id){
    let data = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${id}`);
    let deal = await data.json();
    return deal;
}

async function getFeaturedIDIndexesThatAreOnSale(featuredIds){
    saleIndexes = [];
    console.log('featuredIds.length below');
    console.log(featuredIds.length);
    for(let i = 0; i < featuredIds.length; i++){
        let featuredId = featuredIds[i];
        let data = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${featuredId}`);
        let deal = await data.json();
        
        let onSale = false;
        if(deal.salePrice < deal.retailPrice){
            onSale = true;
        }
        if(onSale){
            saleIndexes.push(i);
        }
        console.log(`${i} out of ${(featuredIds.length - 1)}`);
    }

    return saleIndexes;
}

let getDealAndLength = () => {
    return new Promise((resolve, reject) => {
        fetch('https://www.cheapshark.com/api/1.0/deals', {
            method: 'get'
        })
        .then((res) => {
            return res.json();
        })
        .then((deals) => {
            globalDeals = deals;
            resolve(deals.length);
        })
        .catch(err => {
            console.error('error happeoned in get fresh deals fetch because ' + err.message);
            reject(-1);
        });
    });
}

function addNumber(max){
    let num = Math.floor(Math.random() * max);
    while(popularIndexes.indexOf(num) >= 0){
        num = Math.floor(Math.random() * max);
    }
    popularIndexes.push(num);
}