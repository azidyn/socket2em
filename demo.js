
require('./util/debug');

// const BitMEX = require('./exchange/bitmex');

// let bitmex = new BitMEX();

// bitmex.connect();

// bitmex.subscribe('ETHUSD', 'orderBookL2');


// setInterval( ()=> {

//     let s = bitmex.library.snapshot( 'ETHUSD', 3 );

//     console.log( s );

// }, 500 );

const iByBit = require('./exchange/bybit/inverse');
const ByBit = require('./exchange/bybit/linear');

let bybit = new ByBit();

// let ibybit = new iByBit();
// ibybit.connect();
// ibybit.subscribe('BTCUSD', 'orderBook_200.100ms');

bybit.connect();
bybit.orderbook('BTCUSDT');

setInterval( ()=> {

    // let i = ibybit.library.snapshot( 'BTCUSD', 3 );
    // console.log( i );

    let l = bybit.library.snapshot( 'BTCUSDT', 3 );
    console.log( l );

}, 100 );