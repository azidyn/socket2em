
const Orderbook = require('./Orderbook');

class OrderbookManager {

    constructor() { 
        
        // Multiple orderbooks here, e.g. library['ETHUSD'], library['XBTUSD']
        this.library = { };

    }

    snapshot( instrument, depth ) {

        if ( !this.library[ instrument ] )
            return undefined;

        return this.library[ instrument ].snapshot( depth );
    }

    aggregate( instrument, depth, group ) {

        if ( !this.library[ instrument ] )
            return undefined;

        return this.library[ instrument ].aggregate( depth, group );

    }

    
    handle( msg, instrument ) {

        if ( msg.type == 'snapshot' ) {
            
            const lob = new Orderbook();
            this.library[ instrument ] = lob;

            return this.process( instrument, msg.data, 'init' );

        } else {
            
            return this.process( instrument, msg.data, 'delta' );

        }

    }


    process( instrument, msg, action ) {

        const L = this.library[ instrument ];

        if ( !L ) 
            return;
        
        if ( action == 'init' ) {

            L.insert( msg.order_book || msg );

        } else {

            if ( msg.delete.length ) L.delete( msg.delete );
            if ( msg.update.length ) L.update( msg.update );
            if ( msg.insert.length ) L.insert( msg.insert );

        }

        return { instrument, orderbook: L.lob };
    }


}



module.exports = OrderbookManager;