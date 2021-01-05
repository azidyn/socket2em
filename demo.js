
require('./util/debug');

const BitMEX    = require('./exchange/bitmex');
const iByBit    = require('./exchange/bybit/inverse');
const ByBit     = require('./exchange/bybit/linear');

// let bitmex = new BitMEX();
let ibybit = new iByBit();
// let bybit = new ByBit();

// ibybit.trades('BTCUSD');

ibybit.connect();
// ibybit.orderbook( 'BTCUSD' );
ibybit.trades( 'BTCUSD' );

// ibybit.on('orderbook', state => {

//     console.log( state.instrument );
//     console.log( state.orderbook.snapshot( 1 ));

// });

ibybit.on('trades', trades => {

    console.log( trades )
});


// bybit.orderbook( 'BTCUSDT' );
// bitmex.orderbook( 'XBTUSD' );
// bitmex.trades('XBTUSD');
// bitmex.trades('ETHUSD');

// bitmex.connect();
// ibybit.connect();
// bybit.connect();

// bitmex.on('trades', trades => {
//     console.log( trades );

// })

// bitmex.on('orderbook', state => {
    
//     console.log( state.instrument );
//     console.log( state.orderbook.snapshot(1) );

// })


// setInterval( ()=> {

//     // Snapshot all three orderbooks from BitMEX and Bybit and display

//     // let mex = bitmex.library.snapshot( 'XBTUSD', 3 );
//     // console.log( `\n----- BitMEX XBTUSD -----\n`, mex )    

//     // let ib = ibybit.library.snapshot('BTCUSD', 3 );
//     // console.log( `\n----- Bybit Inverse BTCUSD -----\n`, ib )

//     // let lb = bybit.library.snapshot('BTCUSDT', 3 );
//     // console.log( `\n----- Bybit Linear BTCUSDT -----\n`, lb )


// }, 500 );
