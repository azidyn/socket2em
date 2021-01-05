

let timer = null;
let ptr = 0;

module.exports = { 

    run: ( file, speed=0, cb=null ) => {

        console.log('path: ', file)
        const stream = require( file );


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
