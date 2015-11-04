module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var productSchema = Schema({
		productName: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		}
	});
	var Product = mongoose.model('Product', productSchema);

	return Product;
}