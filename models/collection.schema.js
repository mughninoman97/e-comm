import mongoose from "mongoose";

// collections in 
const collectionSchema  = new mongoose(
    {
        name:{
            type:String,
            required:[true,'please provide a category name'],
            trim:true,
            maxLength:[120,'collection name should be more than 120 chars']

        },
    },
    {
        timestamps:true
    }
);

export default mongoose.model('Collection', collectionSchema)