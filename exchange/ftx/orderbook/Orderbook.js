

/*

    Orderbook.js

    Class that holds a full orderbook (Bid and Ask) for a single instrument
    Handles updates, deletions and insertions

    `this.lob`  the actual orderbook data structure; a class that maintains a sorted list 
                of prices and volume at price. Uses binary search O(log n) to find an entry.
                .snapshot() method returns a reference array of the bid/ask to a given depth
    
*/


const bugger    = buggerit( true );
const Book      = require('../../../lob');

class Orderbook {

    constructor() {

        // Map `id` to price. I kinda hate this, shouldn't really
        // enforce a client-side structure down the wire.

        // When a delete or update is sent from BitMEX, they do not send the price
        // but rather a mysterious 'id' key.
        // The price that the given 'id' maps too is given to us on an earlier insert
        // so we must keep track of it with a Map()

        this.id = new Map();
        this.lob = new Book();

    }
 
    update( deltas ) {

        let delta, price;

        // console.log(`bids: ${deltas.bids.length} asks: ${deltas.asks.length}`);

        for ( delta of deltas.bids ) {
            
            this.lob.bid( delta[0], delta[1] )
        }

        for ( delta of deltas.asks ) {
            
            this.lob.ask( delta[0], delta[1] )
        }

    }

}


module.exports = Orderbook;