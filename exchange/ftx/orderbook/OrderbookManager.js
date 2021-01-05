
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

        let action = msg.type;

        if ( action == 'partial' ) {
            
            // Full book reset on partial

            const lob = new Orderbook();
            this.library[ msg.market ] = lob;

            // console.log( msg )
            return this.process( msg );

        } else {
            
            return this.process( msg );

        }

    }


    process( msg ) {

        if ( !msg.data ) 
            return;

        const instrument = msg.market;
        const L = this.library[ instrument ];

        if ( !L) 
            return;
       
        L.update( msg.data );

        return { instrument, orderbook: L.lob };
    }


}



module.exports = OrderbookManager;