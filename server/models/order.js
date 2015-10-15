/*************************************************************************************
 *	Orders originally belong to different businesses.								 *
 *	HTTP(S) Requests come to Pricing Engine to request 								 *
 *	suggestions based on different criteria they have 								 *
 *	offered services to different end users. Pricing Engine should be 				 *
 *	able to apply the configured discounts and let the business applications		 *
 *	know of line-item-wise application of benefits for a complex scheme, 			 *
 *	or a simple discount after proper validation for simple Coupons or Gift Cards.	 *
 *																					 *
 *	The schema is separated to make sure an orderID and Business Name 				 *
 *	combination be unique across Pricing Engine database. This is to make sure 		 *
 *	there are no ambiguous or repetitive orders when an analysis graphing 			 *
 *	visualizations are done 														 *
 *																					 *
 *************************************************************************************/

module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var orderSchema = Schema({
		scheme : { type: Number, ref: 'scheme' },
		schemeName: {
			type: String
		},
		userId: {
			type: String,
			required: true,
			//	This must be mapped to EndUsers Schema
			// 	which is believed a unique MCRID across systems
		},
		businessName: {
			type: String,
			required: true
		},
		//	This orderID MUST BE UNIQUE across Pricing Engine Database.
		//	Though it is okay for businesses have their own OrderID s in their own systems,
		// 	Pricing Engine should make sure individual orderID s are recorded and a Unique 
		// 	OrderID is created for use with Pricing Engine Statistics & Analysis requirement
	/*	orderId: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},*/
		businessOrderId: {
			type: String,
			required: true
		},
		dateOfService: {
			type: Date
		},
		locationOfService: {
			name: {
				type: String
			},
			geoLocation: {
				type: [Number],
				index: '2d'
			}
		},
		services: {
			type: [String]
		},
		servicesAmount: {
			type: Number
		},
		doctorAmount: {
			type: Number
		},
		doctorChoiceType: {
			type: String
		},
		billAmount: {
			type: Number
		},
		modeOfPayment: {
			type: String,
			enum: "COD,CHEQUE,EPAY".split(",")
		},
		successfullyAvailed: {
			type: Boolean,
			default: false
		}

	});

var Order = mongoose.model('order', orderSchema);
orderSchema.pre('save',function(next){
var schemeName = this.schemeName;
var s = mongoose.model('scheme').find({"metadata.name":this.schemeName}).exec();
s.then(function(data)
{
return data;
}).then(function(data){

if(data.length>0){
	
var o = Order.count({"schemeName":schemeName}).exec();

o.then(function(orderData){

if(data[0].behavior.maximumUsages>orderData){
	next();
}else if(orderData==0)
{
	next();
}else{

 return	next(new Error("Maximum Usages Completed"));
}
})

}else{
	return next(new Error("Invalid Shcema Name"));
}

})
	
})
	return Order;
}