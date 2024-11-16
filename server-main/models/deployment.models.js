import mongoose, { Schema } from "mongoose";
const statusEnum = ['not-started','queued','in-progress','active','error']
const deploymentSchema = new Schema({
    deploymentName:{
        type:String,
        required: true,
    },
    deploymentInitId:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:statusEnum,
        default:'not-started'
    },
    userId:{
        type:Schema.ObjectId,
        ref:'User',
    },
    projectId:{
        type:Schema.ObjectId,
        ref:'Project',
    }
})

export const Deployment = mongoose.model('Deployment',deploymentSchema)