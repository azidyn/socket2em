
/*

	Auto reconnecting WS

	Bit of a mess, old code, needs to be revised when remaining project stable.

	
*/

const WebSocket = require('isomorphic-ws');

const RECONNECT_DURATION = 5;
const HEARTBEAT_DURATION = 90;

let reconnectTimer = null;
let heartTimer = null;

function WebSocketClient( heartbeatDuration, reconnectDuration )
{
	this.number = 0;	// Message number
	this.autoReconnectInterval = 5*1000;	// ms
	this.reconnectDuration = reconnectDuration || RECONNECT_DURATION;
	this.heartbeatDuration = heartbeatDuration || HEARTBEAT_DURATION;
}


WebSocketClient.prototype.resetHeartbeat = function()  
{
    if ( heartTimer )
        clearTimeout( heartTimer );

    heartTimer = setTimeout( () => {

        console.log('\n[WSC] connection stale, sending ping...');

        // Ok, we need to test this possible stale connection. See if the server is still contactable...
        this.instance.send( 'ping' );

        // Set *another* timer to force reconnect the connection if a pong
        // isnt received in RECONNECT_DURATION seconds
        reconnectTimer = setTimeout( () => this.reconnect(), this.reconnectDuration * 1000 )

    }, this.heartbeatDuration * 1000 )

}


WebSocketClient.prototype.open = function(url)
{
	this.url = url;
	this.instance = new WebSocket(this.url);

    // this.instance.on('open',()=>{
	// 	this.onopen();
    // });
	this.instance.onopen = () => {

		this.onopen();

	}
    
    
	// this.instance.on('message',(data,flags)=>{		
	this.instance.onmessage = ( packet, flags ) => {

		this.number ++;

        // Sent by the BitMEX server in response to our 'ping' message as we detected a possible stale connection
        if ( packet.data == 'pong' )        
        {
            console.log( 'pong heartbeat received - cancelling reconnect' );
            if ( reconnectTimer )
                clearTimeout( reconnectTimer );
            
            return; // abort the function now as 'pong' is not a valid JSON to parse here
        }

        this.resetHeartbeat();


		this.onmessage(packet.data,flags,this.number);
	
	};

	// this.instance.on('close',(e)=>{
	this.instance.onclose = (e)=>{
		switch (e.code){
		case 1000:	// CLOSE_NORMAL
			console.log("WebSocket: closed");
			break;
		default:	// Abnormal closure
			this.reconnect(e);
			break;
		}
		this.onclose(e);
	};
	
	// this.instance.on('error',(e)=>{
	this.instance.onerror = (e)=> {
		switch (e.code){
		case 'ECONNREFUSED':
			this.reconnect(e);
			break;
		default:
			this.onerror(e);
			break;
		}
	};
}
WebSocketClient.prototype.send = function(data,option){
	try{
		
		// console.log('\n\nsending\n\n')
		// console.log( this.instance.send );

		this.instance.send(data,option);
		
	}catch (e){
		this.instance.emit('error',e);
	}
}
WebSocketClient.prototype.reconnect = function(e){
	console.log(`[WSC] retry in ${this.autoReconnectInterval}ms` );
    this.instance.removeAllListeners();
	let that = this;

	setTimeout( function() {
		console.log("[WSC] reconnecting...");
		that.open(that.url);
	},this.autoReconnectInterval );

}

WebSocketClient.prototype.onopen = function(e) {	
    console.log("[WSC] open",arguments);	
}
WebSocketClient.prototype.onmessage = function(data,flags,number) {	
    console.log("[WSC] message",arguments);	
}
WebSocketClient.prototype.onerror = function(e) {	
    console.log("[WSC] error",arguments);	
}
WebSocketClient.prototype.onclose = function(e) {	
    console.log("[WSC] closed",arguments);	
}


module.exports = WebSocketClient