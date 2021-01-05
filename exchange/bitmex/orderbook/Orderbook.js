
const bugger    = buggerit( true );
const Book      = require('../../../lob');

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


module.exports = Orderbook;