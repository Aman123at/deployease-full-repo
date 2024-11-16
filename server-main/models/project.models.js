import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    user:{
        type:Schema.ObjectId,
        ref:'User',
    },
    slug:{
        type:String,
        default:""
    },
    gitURL:{
        type:String,
        required:true
    },
    deployedURL:{
        type:String
    },
    commitHash:{
        type:String
    }

})

export const Project = mongoose.model('Project',projectSchema)