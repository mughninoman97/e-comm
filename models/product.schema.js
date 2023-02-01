import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required: [true,'product name is required'],
        trim:true,
        maxLength:[120, 'procut length shoudl be max of 120 chars']
    },
    price:{
        type:String,
        required: [true,'price is required'],
       
        maxLength:[5, 'procut price shoudl not be more than 5 digits']
    },
    description:{
        type:String,
        //use of editor
      
    },
    photos:[
        {
            secure_url:{
                type:String,
                required:true
            }
        }
    ],

    stock:{
        type:Number,
        default:0
    },
    sold:{
        type:Number,
        default:0
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Collection"
    }
   
    

},
{
    timestamps:true
})

export default mongoose.model('Product',productSchema)