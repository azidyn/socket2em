
require('./util/debug');

// const BitMEX = require('./exchange/bitmex');

// let bitmex = new BitMEX();

// bitmex.connect();

// bitmex.subscribe('ETHUSD', 'orderBookL2');


// setInterval( ()=> {

//     let s = bitmex.library.snapshot( 'ETHUSD', 3 );

//     console.log( s );

// }, 500 );

const ByBit = require('./exchange/bybit');

let bybit = new ByBit();

bybit.connect();
bybit.subscribe('BTCUSDT', 'orderBook_200.100ms');

setInterval( ()=> {

    let s = bybit.library.snapshot( 'BTCUSD', 3 );

    console.log( s );

}, 100 );