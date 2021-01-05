
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

            this.process( msg, 'insert' );

        } else {
            
            this.process( msg, action );

        }

    }


    process( msg, action ) {

        if ( !msg.data || !msg.data.length ) 
            return;

        const instrument = msg.data[ 0 ].symbol;

        if ( !this.library[ instrument ] ) 
            return;

        this.library[ instrument ][ action ]( msg.data );
    }


}



module.exports = OrderbookManager;