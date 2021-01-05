
/*

    OrderbookManager.js

    Accepts Websocket messages marked 'orderbookL2' for all instruments.
    Maintains a list of Orderbook objects and routes orderboook delta messages
    to the correct book/instrument.

    
*/



const Orderbook = require('./Orderbook');

class OrderbookManager {

    constructor() { 
        
        // Multiple orderbooks here, e.g. library['ETHUSD'], library['XBTUSD']
        this.library = { };

    }

    snapshot( instrument, depth ) {

        if ( !this.library[ instrument ] )
            return undefined;

        return this.library[ instrument ].lob.snapshot( depth );
    }

    handle( msg ) {

        let action = msg.action;

        if ( msg.action == 'partial' ) {
            
            // Full book reset on partial

            const lob = new Orderbook();
            this.library[ msg.filter.symbol ] = lob;

            return this.process( msg, 'insert' );

        } else {
            
            return this.process( msg, action );

        }

    }


    process( msg, action ) {

        if ( !msg.data || !msg.data.length ) 
            return;

        const instrument = msg.data[ 0 ].symbol;

        if ( !this.library[ instrument ] ) 
            return;

        this.library[ instrument ][ action ]( msg.data );

        return { instrument, orderbook: this.library[ instrument ].lob };
    }


}



module.exports = OrderbookManager;