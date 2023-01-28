import mongoose  from "mongoose";

const orderSchema = mongoose.Schema(
    {
        products: {
            type:[
                {
                    productId:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"Product",
                        required:true
                    },
                    count:Number,
                    price:Number
                }
            ]
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        adress:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        amout:{
            type:Number,
            required:true
        },
        coupon:{
            type:String,
            transactionId:String,
            status:{
                type:String,
                enum:["ORDERED","SHIPPED","DELIVERED","CANCELLED"],
                default:"ORDERED"
            }
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('order', orderSchema)