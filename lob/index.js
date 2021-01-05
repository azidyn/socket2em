
const Bids = require('./bids');
const Asks = require('./asks');

class Book {

    constructor( opts={} ) {

        // this.useref = opts.useref || false;
        this.useref = true;

        this.bids = new Bids( this.useref );
        this.asks = new Asks( this.useref );
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