var mongoose=require('mongoose');
var bcrypt=require('bcrypt');


mongoose.createConnection('mongodb://localhost/t');

var db=mongoose.connection;

var EventSchema=mongoose.Schema({
	ename:{
		type:String,
		index:true
	},
	time:{
		type:String
	},
	details:{type:String}
	,date:{type:Date}
	
});


var Events=module.exports=mongoose.model('Events',EventSchema);


module.exports.createEvent=function(newEvent,callback){
	newEvent.save(callback);
}	

	
