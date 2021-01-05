

let buggerit = ( enabled ) => {
    let on = enabled;
    return text => { 
        if ( on ) console.log( text );
    }
}

if (typeof window !== "undefined") {
    window.buggerit = buggerit;
} else {
    global.buggerit = buggerit;
}



