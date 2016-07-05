db = require('nai-sql').init('rasool.rdf');

var calcUniquePriceOr = function( product, customer, callback ){
	var ret = {};
	db.query()
	.select([
		't2.value AS default_price'
	], 'products t1')
	.leftJoin('prices t2', 't2.id = t1.price')
	.where('t1.id = ?', [product])
	.run( function(result){
		ret.default_price = result[0].default_price;
		db.query()
		.select([
			't2.value AS unique_price'
		], 'customers t1')
		.leftJoin('prices_groups t2', 't2.grp = t1.grp')
		.where('t1.id = ?', [customer])
		.run( function(result2){
			ret.unique_price = result2[0].unique_price;
			callback( ret.unique_price? ret.unique_price: ret.default_price );
		});
	});
}


calcUniquePriceOr( 1, 1, function(val){
	console.log( val );
});