
const Bids = require('./bids');
const Asks = require('./asks');

class Book {

    constructor() {
        this.bids = new Bids();
        this.asks = new Asks();
    }

    bid( price, size ) {
        this.bids.set( price, size );
    }

    ask( price, size ) {
        this.asks.set( price, size );
    }

    peek( side, price ) {

        return side == 'ask' ? this.asks.peek( price ) : this.bids.peek( price );

    }

    snapshot( levels ) {
        return {
            bid: this.bids.snapshot( levels ),
            ask: this.asks.snapshot( levels )
        }
    }

}

module.exports = Book;