
require('./util/debug');

const BitMEX    = require('./exchange/bitmex');
const iByBit    = require('./exchange/bybit/inverse');
const ByBit     = require('./exchange/bybit/linear');

let bitmex = new BitMEX();
let ibybit = new iByBit();
let bybit = new ByBit();

ibybit.orderbook( 'BTCUSD' );
bybit.orderbook( 'BTCUSDT' );
bitmex.orderbook( 'XBTUSD' );

bitmex.connect();
ibybit.connect();
bybit.connect();

setInterval( ()=> {

    // Snapshot all three orderbooks from BitMEX and Bybit and display

    let mex = bitmex.library.snapshot( 'XBTUSD', 3 );
    console.log( `\n----- BitMEX XBTUSD -----\n`, mex )    

    let ib = ibybit.library.snapshot('BTCUSD', 3 );
    console.log( `\n----- Bybit Inverse BTCUSD -----\n`, ib )

    let lb = bybit.library.snapshot('BTCUSDT', 3 );
    console.log( `\n----- Bybit Linear BTCUSDT -----\n`, lb )


}, 500 );
