
require('./util/debug');


const BitMEX = require('./exchange/bitmex/connection');

let bitmex = new BitMEX({ simulate: 250 });

bitmex.connect();

bitmex.subscribe('ETHUSD', 'orderBookL2_25');
// bitmex.subscribe('XBTUSD', 'orderBookL2');


setInterval( ()=> {

    let s = bitmex.library.snapshot( 'ETHUSD', 3 );

    console.log( `ETHUSD...`)
    console.log( s );

    // s = bitmex.library.snapshot( 'XBTUSD', 3 );

    // console.log( `XBTUSD...`)
    // console.log( s );

}, 500 );
