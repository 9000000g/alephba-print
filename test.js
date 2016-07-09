var db = require('nai-sql').init('/home/nainemom/Desktop/rasoolDb.rdf');
var calcUniquePriceOr = function( product, customer, callback ){
  var ret = {};
  db.query()
  .select([
    't2.value AS default_price'
  ], 'products t1')
  .leftJoin('prices t2', 't2.id = t1.price')
  .where('t1.id = ?', [product])
  .run( function(result){
	console.log( 'default: ', result[0].default_price );
    ret.default_price = result[0].default_price;
    db.query()
    .select([
      't2.value AS unique_price'
    ], 'customers t1')
    .leftJoin('prices_groups t2', 't2.grp = t1.grp')
    .where('t1.id = ?', [customer])
    .run( function(result2){
		console.log( 'unique: ', result2[0].unique_price );		
	ret.unique_price = result2[0].unique_price;
      callback( ret.unique_price? ret.unique_price: ret.default_price );
    });
  });
}

calcUniquePriceOr( 3, 1, function(value){
  console.log(value);
});
