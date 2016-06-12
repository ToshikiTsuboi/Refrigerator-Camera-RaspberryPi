const vision = require('node-cloud-vision-api');
var spawn = require('child_process').spawn;
var io = require('socket.io-client');

socketioconnect();

// Take Picture
function takePicture(){	
	var proc;
	var args = ["-w", "1280", "-h", "960","-o","/home/pi/Pictures/image_stream.jpg"]
	proc = spawn('raspistill', args);
}

// Raspberry Pi (socketio client side)
function socketioconnect(){
	var socketURL = "https://thawing-castle-56758.herokuapp.com";	// heroku縺ｮURL	
	var socket = io.connect(socketURL);
	var jsonresult;
	socket.on("connect",function(){
  		console.log("OK!");
  	socket.on("receiveHeroku",function(msg){
  		takePicture();  	
  		cloudvision()	
  		//console.log("25"+cloudvision());
  	});
	});
	socket.on("connect failed",function(){
  		console.log("NG!");
	});
}
// CloudVision API call
function cloudvision(){	
	var result = [];
	vision.init({auth: 'CLOUDVISION_API_KEY'})  // init with auth
	// construct parameters
	const req = new vision.Request({
  		image: new vision.Image('/home/pi/Pictures/image_stream.jpg'),
  		features: [
    		//new vision.Feature('FACE_DETECTION', 4),
    		new vision.Feature('LABEL_DETECTION', 15),
    		new vision.Feature('LOGO_DETECTION',10),
  		]
	})
	// send single request
	response = vision.annotate(req).then((res) => {
	  	JSON.parse(JSON.stringify(res.responses),function(key, value) {
	    if (key == "description"){
	    	//console.log(key + ":" + value);
	    	result.push(value);	    					    	
	    }		
		}); 	
		var proc;
		var args = ['slackpost.py','memo_tsuboi','冷蔵庫にある食材は'+result+'です','/home/pi/Pictures/image_stream.jpg','IoTBot']
		proc = spawn('python',args);
                console.log("54"+result); 		    
	})
	 
}


