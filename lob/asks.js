


class Asks {

    constructor( ) {
        
        /*
            ordered list of prices which point to an index

            [ 
                [ price, quantity],
                [ 1234.5, 10000 ],
                ...
            ]
        */
       this.ticks = [];


       // Array index pointing to the best quote, must keep track of this
       this.head = 0;

       this.set = this.set_asks;

    }

    peek( price ) {
        
        // book empty
        if ( !this.ticks.length )
            return null;

        const i = this.find( price );
        const item = this.ticks[ i ];

        if ( item[0] == price ) 
            return item;
        
        // price not found
        return null;
    }


    set_asks( price, size ) {

        // First insert
        if ( !this.ticks.length ) {
            this.ticks.push([ price, size ]);
            this.head = 0;
            return;
        }

        // Binary search our asks[] for closest price
        const i = this.find( price );
        const itemhead = this.ticks[ this.head ];
        
        // Get the returned [ price, volume ]
        const item = this.ticks[ i ];

        // Found an exact (existing price level) match?
        if ( item[0] == price ) {

            // Update the size
            item[1] = size;
            
            if ( this.head == i && size == 0 ) {

                // The current update is on the head which is being deleted!    
                // Find the next item in the book with volume 

                this.head = this._nz_scan( i + 1 );
                this.headcheck();
       
            } else if ( price < this.ticks[ this.head ][0] ) {

                // The current update is for a price lower than our current head
                // so set the new head
                // This would be a previously inserted head/node/pricelevel that had been zeroed
                // at some point before and is now being reestablished

                this.head = i;
            }

            return;
        }

        // New price level, insert it now

        const before = price < item[0];
        let ins = before ? i : i + 1;

        // Insert the new price level at array index `ins`
        this.ticks.splice( ins, 0, [ price, size ] );

        // Inserted a new level in front of the head. `this.head` index must be updated now
        // Note that `this.head` index is invalid now anyway because of the insert
        if ( before && price < itemhead[0] ) {
            this.head = this._nz_scan( ins );
            this.headcheck();
        }

    }

    headcheck() {

        // If the book was overwritten with zeroes (eliminating all volume at price) 
        // This can be an invalid mess, so just wipe the book continuously
        // if zeros continue to be inserted. Big speed penalty but this is totally unsupported behavior.
        if ( this.head == null ) {
            this.head = 0;
            this.ticks = [];
        }
            

    }    

    // Snapshot of the order book (prices with volume) for a given number of levels
    snapshot( levels ) {

        let book = [];

        if (!this.ticks.length ) return book;
        
        for ( let t=this.head; t<this.ticks.length; t++) {

            if ( this.ticks[t][1] > 0 ) book.push( [ this.ticks[t][0], this.ticks[t][1] ] );
            if ( book.length == levels ) break;

        }

        return book;

    }

    // Modified binary search
    find( target ) {

        let arr = this.ticks;
        let n = arr.length;

        // Corner cases 
        if ( target <= arr[0][0] ) 
            return 0;//arr[0]; 

        if ( target >= arr[n - 1][0] ) 
            return n-1;//arr[n - 1]; 

        // Doing binary search  
        let i = 0, j = n, mid = 0; 

        while (i < j) 
        { 
            mid = ( i + j ) >> 1;

            if ( arr[mid][0] == target ) {
                return mid;//arr[mid]; 
            }

            /* If target is less  
            than array element, 
            then search in left */
            if ( target < arr[mid][0] )  
            { 
                // If target is greater  
                // than previous to mid,  
                // return closest of two 
                if (mid > 0 && target > arr[mid - 1][0] )   {
                    
                    // console.log('<mid')
                    // return this._getClosest( arr[mid - 1], arr[mid], target ); 
                    return this._getClosest( mid - 1, mid, target ); 
                }
                /* Repeat for left half */
                j = mid;              
            
            } else { 
                // If target is  
                // greater than mid 
                
                if ( mid < n-1 && target < arr[mid + 1][0] )  {
                    // console.log('arr=', arr);
                    // console.log(`mid=${mid}`);
                    // return this._getClosest( arr[mid],  arr[mid + 1], target );
                    return this._getClosest( mid,  mid + 1, target );
                }

                i = mid + 1; // update i 
            } 

        }         
        
    }

    // Step through existing levels from index `from` => upwards,
    // look for the first price level with volume 
    _nz_scan( from ) {

        for ( let t=from; t<this.ticks.length;t++)
            if ( this.ticks[t][1] > 0 ) return t;

    }

    _getClosest(val1, val2, target)  { 

        
        if (target - this.ticks[val1][0] >= this.ticks[val2][0] - target)  
            return val2;
        else
            return val1;

    }     
}

module.exports = Asks;