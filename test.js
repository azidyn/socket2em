
require('./util/debug');


const BitMEX = require('./bitmex/connection');

let bitmex = new BitMEX({ simulate: 100 });

bitmex.connect();

bitmex.subscribe('ETHUSD', 'orderBookL2_25');


setInterval( ()=> {

    let s = bitmex.library.snapshot( 'ETHUSD', 3 );

    console.log('snapshot...');
    console.log( s );

}, 250 );
