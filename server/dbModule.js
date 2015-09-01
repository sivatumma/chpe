
var models = [
	"associate",
	"consumer",
	"product",
	"roles",
	"user",
	"scheme",
	"order",
	"diagnostic"
];

exports.initialize = function() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
        require(modelsFolder + models[i])();
    }
};