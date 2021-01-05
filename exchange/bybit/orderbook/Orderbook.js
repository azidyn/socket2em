
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

        let delta, price, size;

        for ( delta of deltas ) {
        
            // Make a note of which id => price, need this for updates/deletes
            // this.id.set( delta.id, delta.price );

            price = Number( delta.price );
            size = Number( delta.size );

            // Apply the delta
            if ( delta.side == 'Buy' ) 
                this.lob.bid( price, size );
            else 
                this.lob.ask( price, size );

        }
       
    }

    update( deltas ) {

        let delta, price, size;

        for ( delta of deltas ) {

            price = Number( delta.price );
            size = Number( delta.size );
                
            if ( delta.side == 'Buy' ) 
                this.lob.bid( price, size )
            else
                this.lob.ask( price, size )
        }       

    }

    delete( deltas ) {

        let delta, price, size

        for ( delta of deltas ) {

            price = Number( delta.price );

            if ( delta.side == 'Buy' ) 
                this.lob.bid( price, 0 )
            else
                this.lob.ask( price, 0 )

        }             


    }

}


module.exports = Orderbook;