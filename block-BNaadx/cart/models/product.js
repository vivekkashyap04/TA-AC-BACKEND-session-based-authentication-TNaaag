const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  quantity: Number,
  price: Number,
  likes: { type: Number, default: 0 },
  usedId:{type:Schema.Types.ObjectId,required:true,ref:'User'}
});

module.exports = mongoose.model('Product', productSchema);
