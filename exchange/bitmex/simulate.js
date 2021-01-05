
const stream = require('./ethusd-l2-stream.json');
let timer = null;
let ptr = 0;

module.exports = { 

    run: ( speed=0, cb=null ) => {

        if ( speed != 0 ) {

            if ( timer ) return ;

            timer = setInterval( () => { 
                cb( stream[ptr++] );
                if ( ptr >= stream.length )
                    clearInterval( timer );

            }, speed );

        } else if ( cb ) {
            for ( let s of stream )
                cb( s );
        }
    }

}
