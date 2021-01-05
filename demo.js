
require('./util/debug');

const BitMEX    = require('./exchange/bitmex');
const iByBit    = require('./exchange/bybit/inverse');
const ByBit     = require('./exchange/bybit/linear');

let bitmex = new BitMEX();
let ibybit = new iByBit();
let bybit = new ByBit();

bitmex.trades( 'XBTUSD' );
bybit.trades( 'BTCUSDT' );
ibybit.trades( 'BTCUSD' );

ibybit.orderbook( 'BTCUSD' );
bitmex.orderbook( 'XBTUSD' );
bybit.orderbook( 'BTCUSDT' );


bybit.connect();
ibybit.connect();
bitmex.connect();


function show_trades( trades )  {
    
    for ( let t of trades ) 
        console.log(`${t.exchange} ${t.side} ${t.symbol} ${t.size} @ ${t.price}`);
}

bitmex.on('trades', show_trades )
bybit.on('trades', show_trades )
ibybit.on('trades', show_trades )

/* 

Can also use event to snapshot order book like this: 

*/
// ibybit.on('orderbook', state => {
//     console.log( state.instrument );
//     console.log( state.orderbook.snapshot( 3 ).ask );
//     console.log( state.orderbook.snapshot( 3 ).bid );
// });


setInterval( ()=> {

    // Snapshot all three orderbooks from BitMEX and Bybit and display

    console.log(`\n---- Orderbook Snapshots ----\n`)

    let mex = bitmex.library.snapshot( 'XBTUSD', 3 );
    console.log( `\nBitMEX XBTUSD`, mex )    

    let ib = ibybit.library.snapshot('BTCUSD', 3 );
    console.log( `\nBybit Inverse BTCUSD`, ib )

    let lb = bybit.library.snapshot('BTCUSDT', 3 );
    console.log( `\nBybit Linear BTCUSDT\n`, lb )

    console.log(' ');

}, 3000 );
