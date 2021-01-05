# socket2em
Websocket (*Browser*, web) based crypto exchange data feeds consumption and normalization. Work in progress.

Connect and consume orderbooks, live trades and possibly other exchange metrics (liquidations, OI, funding etc) through a normalized interface
also providing direct orderbook management built-in.

### Project aims to support browsers natively for **serverless applications** with a focus on performance, minimal memory reqs etc.

Some exchange code will require an http CORS proxy, this is unfortunately unavoidable due to some exchanges' implementations. e.g. Binance requires snapshotting the orderbook via REST before accepting deltas over Websocket...bizarre and stupid but ok. Simple preliminary solution is to use a Cloudflare web function to proxy requests but I'm getting ahead of myself here.

Initial exchange support will be of the Websocket only variety.

