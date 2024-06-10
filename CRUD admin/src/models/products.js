import mongoose from 'mongoose';
const productSchema = new mongoose.Schema(
    {
        name: {type: String, require: true}, 
        subtitle: {type: String},
        type:[String],
        imageSrc: {type: String, require: true},
        discount: {type: String},
        price: {type: mongoose.Schema.Types.Mixed, require: true}, 
        start: {type: String, require: true}, 
    }, 
    {timestamps: true, versionKey: false}
);
export default mongoose.model("Product", productSchema);