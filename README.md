# socket2em
Websocket (*Browser*, web) based crypto derivative exchange data feeds consumption and normalization. Work in progress.

Connect and consume orderbooks, live trades and possibly other exchange metrics (liquidations, OI, funding etc) through a normalized interface
also providing robust and fast orderbook management built-in.

### Project aims to support browsers natively for **serverless applications** with a focus on performance, minimal memory reqs etc.

Some exchange code will require an http CORS proxy, this is unfortunately unavoidable due to some exchanges' implementations. e.g. Binance requires snapshotting the orderbook via REST before accepting deltas over Websocket...bizarre and stupid but ok. Simple preliminary solution is to use a Cloudflare web function to proxy requests but I'm getting ahead of myself here.

Initial exchange support will be of the Websocket-only variety.

### Current state of project

See `demo.js` for working example.

```js

/*  Initialize and subscribe  */

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

```

Update events; subscribe to 'trades' and/or 'orderbook' like this:

```js

bitmex.on('trades', show_trades )
bybit.on('trades', show_trades )
ibybit.on('trades', show_trades )


function show_trades( trades )  {
    
    for ( let t of trades ) 
        console.log(`${t.exchange} ${t.side} ${t.symbol} ${t.size} @ ${t.price}`);
}


```

For the orderbook, can also just make a snapshot on a timer when you choose

```js

setInterval( ()=> {

    // Snapshot all three orderbooks from BitMEX and Bybit and display every 3.0 seconds

    console.log(`\n---- Orderbook Snapshots ----\n`)

    let mex = bitmex.library.snapshot( 'XBTUSD', 3 );
    console.log( `\nBitMEX XBTUSD`, mex )    

    let ib = ibybit.library.snapshot('BTCUSD', 3 );
    console.log( `\nBybit Inverse BTCUSD`, ib )

    let lb = bybit.library.snapshot('BTCUSDT', 3 );
    console.log( `\nBybit Linear BTCUSDT\n`, lb )

    console.log(' ');

}, 3000 );


```

Output ...

```
ibybit buy BTCUSD 10000 @ 33831
bitmex buy XBTUSD 134 @ 33814.5
bitmex buy XBTUSD 5000 @ 33814.5
bitmex buy XBTUSD 705 @ 33814.5
bitmex buy XBTUSD 23 @ 33814.5
bitmex buy XBTUSD 10 @ 33814.5
bitmex buy XBTUSD 400 @ 33814.5
bitmex buy XBTUSD 3728 @ 33814.5
bitmex buy XBTUSD 10 @ 33815
bitmex buy XBTUSD 400 @ 33815.5
ibybit sell BTCUSD 13 @ 33830.5
ibybit sell BTCUSD 4 @ 33830.5

---- Orderbook Snapshots ----


BitMEX XBTUSD { bid: [ [ 33816, 597071 ], [ 33815.5, 67000 ], [ 33815, 24100 ] ],
  ask: [ [ 33816.5, 530 ], [ 33817.5, 400 ], [ 33818.5, 400 ] ] }

Bybit Inverse BTCUSD { bid:
   [ [ 33830.5, 2386674 ], [ 33830, 136618 ], [ 33829.5, 211 ] ],
  ask: [ [ 33831, 82102 ], [ 33831.5, 5 ], [ 33832.5, 2042 ] ] }

Bybit Linear BTCUSDT
 { bid:
   [ [ 33745, 54.163998 ], [ 33744.5, 27.166 ], [ 33744, 18.719 ] ],
  ask: [ [ 33745.5, 0.002 ], [ 33747.5, 0.439 ], [ 33749, 0.712 ] ] }
 
ibybit buy BTCUSD 12694 @ 33831
ibybit buy BTCUSD 250100 @ 33831
ibybit sell BTCUSD 15 @ 33830.5
bybit buy BTCUSDT 675 @ 33745.5



```

