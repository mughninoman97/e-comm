import mongoose from "mongoose";

const coupnSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required:[true,'please provide coupn name']
        },
        discount: {
            type: Number,
            default:0
        },
        active: {
            type: Boolean,
            default:true
        },
    },
    {
        timestamps:true
    }
)

export default mongoose.model('Coupn', coupnSchema)