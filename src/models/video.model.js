import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({

}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const User = mongoose.model('User', videoSchema)