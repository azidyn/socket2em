

const BitMEX = require('./bitmex/connection');

let bitmex = new BitMEX({ simulate: 100 });

bitmex.connect();

bitmex.subscribe('ETHUSD', 'orderBookL2_25');


