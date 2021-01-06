
require('./util/debug');

const BitMEX    = require('./exchange/bitmex');
const iByBit    = require('./exchange/bybit/inverse');
const ByBit     = require('./exchange/bybit/linear');
const FTX       = require('./exchange/ftx');

let bitmex  = new BitMEX();
let ibybit  = new iByBit();
let bybit   = new ByBit();
let ftx     = new FTX();

bitmex.trades( 'XBTUSD' );
bybit.trades( 'BTCUSDT' );
ibybit.trades( 'BTCUSD' );
ftx.trades( 'BTC-PERP' );

ibybit.orderbook( 'BTCUSD' );
bitmex.orderbook( 'XBTUSD' );
bybit.orderbook( 'BTCUSDT' );
ftx.orderbook( 'BTC-PERP' );



bybit.connect();
ibybit.connect();
bitmex.connect();
ftx.connect();


function show_trades( trades )  {
    
    for ( let t of trades ) 
        console.log(`${t.exchange} ${t.side} ${t.symbol} ${t.size} @ ${t.price}`);
}

// bitmex.on('trades', show_trades )
// bybit.on('trades', show_trades )
// ibybit.on('trades', show_trades )
// ftx.on('trades', show_trades )

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

    // console.log(`\n---- Orderbook Snapshots ----\n`)

    let mex = bitmex.library.snapshot( 'XBTUSD', 10 );
    
    if ( mex )
        console.log(  mex )    

    let agg = bitmex.library.aggregate('XBTUSD', 5, 50 );

    if ( agg )
        console.log('\n', agg );

    // let ib = ibybit.library.snapshot('BTCUSD', 3 );
    // console.log( `\nBybit Inverse BTCUSD`, ib )

    // let lb = bybit.library.snapshot('BTCUSDT', 3 );
    // console.log( `\nBybit Linear BTCUSDT\n`, lb )

    // let ft = ftx.library.snapshot('BTC-PERP', 3 );
    // console.log( `\FTX BTC-PERP\n`, ft )

    console.log(' ');

}, 2500 );
