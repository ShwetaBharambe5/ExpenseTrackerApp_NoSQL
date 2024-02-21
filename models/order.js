const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema=new Schema({
    id:
    {
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true
        
    },
    paymentid:String,
    orderid:String,
    status:String,

});

const Order = mongoose.model('Order',orderSchema);

module.exports=Order;