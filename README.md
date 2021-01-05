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

const BitMEX = require('./exchange/bitmex');

let bitmex = new BitMEX();

bitmex.connect();

bitmex.subscribe('ETHUSD', 'orderBookL2');
bitmex.subscribe('XBTUSD', 'orderBookL2');

```

Then after some time....

```js

/* Snapshot the ETH and XBT orderbooks at 3 levels deep */

let eth_orderbook = bitmex.library.snapshot( 'ETHUSD', 3 );

console.log( `ETHUSD...`)
console.log( eth_orderbook );

let xbt_orderbook = bitmex.library.snapshot( 'XBTUSD', 3 );

console.log( `XBTUSD...`)
console.log( xbt_orderbook );

```

Output ...

```

ETHUSD...
{ bid: [ [ 1019.4, 467 ], [ 1019, 150 ], [ 1018.95, 50 ] ],
  ask: [ [ 1019.75, 500 ], [ 1019.8, 12053 ], [ 1019.85, 12050 ] ] }
XBTUSD...
{ bid:
   [ [ 31500.5, 350557 ], [ 31500, 105000 ], [ 31499.5, 110105 ] ],
  ask: [ [ 31501, 187320 ], [ 31502.5, 100 ], [ 31504.5, 4 ] ] }

```

