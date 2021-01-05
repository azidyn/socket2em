
const bugger    = buggerit( true );
const Book      = require('../../lob');

class Orderbook {

    constructor() {

        // Map `id` to price. I kinda hate this, BitMEX. Shouldn't really
        // enforce a client-side structure down the wire.

        this.id = new Map();
        this.lob = new Book();

    }
    
    insert( deltas ) {

        let delta;

        for ( delta of deltas ) {
        
            // Make a note of which id => price, need this for updates/deletes
            this.id.set( delta.id, delta.price );

            // Apply the delta
            if ( delta.side == 'Buy' ) 
                this.lob.bid( delta.price, delta.size );
            else 
                this.lob.ask( delta.price, delta.size );

        }
        
    }

    update( deltas ) {

        let delta, price;

        for ( delta of deltas ) {

            price = this.id.get( delta.id );

            if ( !price ) 
                continue;
                
            if ( delta.side == 'Buy' ) 
                this.lob.bid( price, delta.size )
            else
                this.lob.ask( price, delta.size )
        }       

    }

    delete( deltas ) {

        let delta, price;

        for ( delta of deltas ) {

            price = this.id.get( delta.id );
            
            if ( !price ) 
                continue;

            if ( delta.side == 'Buy' ) 
                this.lob.bid( price, 0 )
            else
                this.lob.ask( price, 0 )

        }             


    }

}


/*

    Handles all traffic labelled 'orderbookL2' and delegates to specific symbol

*/

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