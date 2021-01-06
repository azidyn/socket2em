
class Aggregate {
    constructor() {
        this.gbid = [], this.gask = [];
    }

    group( bid, ask, levels, group, dp=0 ) {

        if ( levels != this.gbid.length ) 
            this.gbid = [];

        if ( levels != this.gask.length ) 
            this.gask = [];

        const max = Math.max( bid.length, ask.length );
        const quote = bid[0][0];

        let l = -1, i = -1, j = 0;

        for ( ; j<max; j++ ) {
            const b = bid[ j ];
            const r = this.price_to_agg( b[0], group, quote );

            if (r != l ) {
                if ( ++i >= levels ) break;
                if ( !this.gbid[ i ] ) this.gbid[ i ] = [];

                this.gbid[ i ][ 0 ] = r;
                this.gbid[ i ][ 1 ] = b[ 1 ];

                l = r; 
            } else {
                this.gbid[i][1] = Number( ( this.gbid[i][1] + b[1] ).toFixed( dp ) )

            }
        }

        l = -1; i = -1; j = 0;
        
        for (; j<max; j++ ) {
        
            const a = ask[ j ];
            const r = this.price_to_agg( a[0], group, quote );// round_to_tick( a[0], tick, 1 );
        
            if ( r != l ) {
                if ( ++i >= levels) break;
                if ( !this.gask[ i ] ) this.gask[ i ] = [];

                this.gask[ i ][ 0 ] = r;
                this.gask[ i ][ 1 ] = a[ 1 ];

                l = r;
            } else {
                this.gask[ i ] [ 1 ] = Number( (this.gask[ i ] [ 1 ] + a[ 1 ]).toFixed( dp ) );
            }
        }          

        return { bid: this.gbid, ask: this.gask }

    }


    price_to_agg( price, group, quote )  {
        let shift = price > quote ? group - ( quote % group ) : 0;
        return ( price + shift ) - (( price + shift) % group);
    }    
}

module.exports = Aggregate