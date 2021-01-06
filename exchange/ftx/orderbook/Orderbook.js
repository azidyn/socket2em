

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

        this.lob = new Book();

    }

    aggregate( depth, group ) {
        
        return this.lob.aggregate( depth, group, 3);

    }

    snapshot( depth ) {

        return this.lob.snapshot( depth );

    }    
 
    update( deltas ) {

        let delta;

        for ( delta of deltas.bids )
            this.lob.bid( delta[0], delta[1] )

        for ( delta of deltas.asks )
            this.lob.ask( delta[0], delta[1] )

    }

}


module.exports = Orderbook;