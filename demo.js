
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

let bybit = new ByBit({ simulate: 1000 });

bybit.connect();
bybit.subscribe('BTCUSD', 'orderBook_200.100ms');

