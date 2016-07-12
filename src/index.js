var app = require('app');
var BrowserWindow = require('browser-window');
var http 				= require('http').createServer().listen(1362);
var io 					= require('socket.io')(http);
var db					= false;
var mainWindow = null;

app.on('window-all-closed', function() {
	if (process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		resizable: true,
		center: true,
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		'node-integration': false
	});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');
	//mainWindow.setFullScreen(true);
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
	
	
io.on('connection', function(socket){
	socket.on('exit', function(){
		if (process.platform != 'darwin')
			app.quit();
		else
			mainWindow.minimize();
	})
	socket.on('selectFile', function(data, callback){
		try{
			var file;
			if( typeof data.file == 'undefined' || !data.file ){
				var dialog = require('dialog');
				var selectedFiles = dialog.showOpenDialog({
					properties: ['openFile'],
					filters: [
						{name: 'Rasool Database File', extensions: ['rdf']}
					]
				});
				if( typeof selectedFiles != 'undefined' && selectedFiles.constructor == Array ){
					data.file = selectedFiles[0];
				}
				else{
					data.file = false;
				}
			}
			if( data.file && require('fs').lstatSync(data.file).isFile() ){
				db = require('nai-sql').init(data.file);
				callback( false, data.file );
			}
			else{
				db = false;
				callback( true, false );
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	socket.on('newFile', function(data, callback){
		try{
			var file;
			var dialog = require('dialog');
			var selectedFiles = dialog.showSaveDialog();
			if( typeof selectedFiles != 'undefined' && selectedFiles.constructor == String ){
				file = selectedFiles + '.rdf';
			}
			else{
				file = false;
			}
			
			if( file != false ){
				db = require('nai-sql').init();
				db.query().create('customers',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'grp': 'INTEGER',
					'code': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('groups',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('prices',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'code': 'TEXT',
					'value': 'INTEGER'
				}).run();
				db.query().create('prices_groups',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'price': 'INTEGER',
					'grp': 'INTEGER',
					'value': 'INTEGER'
				}).run();
				db.query().create('products',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'name': 'TEXT',
					'code': 'TEXT',
					'price': 'INTEGER',
					'cnt': 'INTEGER DEFAULT 0',
					'description': 'TEXT'
				}).run();
				db.query().create('sales',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'customer': 'INTEGER',
					'date': 'TEXT',
					'description': 'TEXT'
				}).run();
				db.query().create('sales_detail',{
					'id': 'INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL',
					'sale': 'INTEGER',
					'product': 'INTEGER',
					'cnt': 'INTEGER'
				}).run();
				db.save(file);
				db.dbFile = file;
				callback( false, file );
			}
			else{
				db = false;
				callback( true, false );
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('customers-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			db.query()
			.select([
				't1.id',
				't1.name',
				't1.code',
				't1.description',
				't2.id AS grp',
				't2.name AS grp_name'
			], 'customers t1')
			.leftJoin('groups t2', 't1.grp = t2.id')
			.where( 't1.id' + (data.id!==false? ('= '+data.id): '> 0') )
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('customers-set', function(data, callback){
		try{
			if( typeof data.id == 'undefined' || data.id == 'new' ){
				delete data.id;
				delete data.grp_name;
				db.query()
				.insert('customers', data)
				.run(function(result){
					callback(false, result);
				});
			}
			else{
				delete data.grp_name;
				db.query()
				.update('customers', data)
				.where('id LIKE ?', [data.id])
				.run(function(result){
					callback(false, result);
				});
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('customers-del', function(data, callback){
		try{
			db.query()
			.delete('customers')
			.where('id = ?', [data.id])
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('groups-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			db.query()
			.select([
				't1.id',
				't1.name',
				't1.description',
				'COUNT(t2.id) AS cnt',
			], 'groups t1')
			.leftJoin('customers t2', 't1.id = t2.grp')
			.where( 't1.id' + (data.id!==false? ('= '+data.id): '> 0') )
			.groupBy('t1.id')
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('groups-set', function(data, callback){
		try{
			if( typeof data.id == 'undefined' || data.id == 'new' ){
				delete data.id;
				delete data.cnt;
				db.query()
				.insert('groups', data)
				.run(function(result){
					callback(false, result);
				});
			}
			else{
				delete data.cnt;
				db.query()
				.update('groups', data)
				.where('id LIKE ?', [data.id])
				.run(function(result){
					callback(false, result);
				});
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('groups-del', function(data, callback){
		try{
			db.query()
			.delete('groups')
			.where('id = ?', [data.id])
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('prices-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			
			db.query()
			.select('*', 'prices')
			.where( 'id ' + (data.id!==false? ('= '+data.id): 'LIKE "%"') )
			.run(function(result){
				for( var i = 0; i < result.length; i++ ){
					result[i].prices = [];
					db.query()
					.select('*', 'prices_groups')
					.where( 'price = ?', [ result[i].id ] )
					.run( function(result2){
						for( var j = 0; j < result2.length; j++ )
							delete result2[j].id;
						result[i].prices = result2;
					});
				}
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('prices-set', function(data, callback){
		try{
			var prices = data.prices;
			for( var i = 0; i < prices.length; i++ )
				delete prices[i].id;
			delete data.prices;
			if( typeof data.id == 'undefined' || data.id == 'new' ){
				delete data.id;
				db.query()
				.insert('prices', data)
				.run(function(result){
					db.query()
					.select('MAX(id) AS priceId', 'prices')
					.run( function( result2 ){
						for( var j = 0; j < prices.length; j++ ){
							if( typeof prices[j].value != 'number' ) continue;
							delete prices[j].id; 
							delete prices[j].grp_name; 
							delete prices[j].$$hashKey; 
							prices[j].price = result2[0].priceId;
							db.query()
							.insert('prices_groups', prices[j])
							.run();
						}
						callback(false, result);
					});
					

				});
			}
			else{
				db.query()
				.update('prices', data)
				.where('id = ?', [data.id])
				.run(function(result){
					db.query()
					.delete('prices_groups')
					.where( 'price = ?', [ data.id ] )
					.run(function(result2){
						for( var j = 0; j < prices.length; j++ ){
							if( typeof prices[j].value != 'number' ) continue;
							delete prices[j].id;
							delete prices[j].grp_name; 
							delete prices[j].$$hashKey; 
							prices[j].price = data.id;
							db.query()
							.insert('prices_groups', prices[j])
							.run();
						}

					});
					callback(false, result);
				});
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('prices-del', function(data, callback){
		try{
			db.query()
			.delete('prices')
			.where('id = ?', [data.id])
			.run(function(result){
				db.query()
				.delete('prices_groups')
				.where( 'price = ?', [ data.id ] )
				.run(function(result2){
					callback(false, result);
				});
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('products-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			db.query()
			.select([
				't1.id',
				't1.name',
				't1.cnt',
				't1.description',
				't1.price',
				't2.code AS price_code',
				't2.value AS price_value',
			], 'products t1')
			.leftJoin('prices t2', 't1.price = t2.id')
			.where( 't1.id ' + (data.id!==false? ('= '+data.id): 'LIKE "%"') )
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('products-set', function(data, callback){
		try{
			if( typeof data.id == 'undefined' || data.id == 'new' ){
				delete data.id;
				delete data.price_code;
				delete data.price_value;
				data.cnt = typeof data.cnt != 'number'? 0: data.cnt;
				db.query()
				.insert('products', data)
				.run(function(result){
					callback(false, result);
				});
			}
			else{
				delete data.price_code;
				delete data.price_value;
				data.cnt = typeof data.cnt != 'number'? 0: data.cnt;
				db.query()
				.update('products', data)
				.where('id = ?', [data.id])
				.run(function(result){
					callback(false, result);
				});
			}
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('products-del', function(data, callback){
		try{
			db.query()
			.delete('products')
			.where('id = ?', [data.id])
			.run(function(result){
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('sales-get', function(data, callback){
		try{
			if( typeof data.id == 'undefined' )
				data.id = false;
			var calcUniquePriceOr = function( product, customer, callback ){
				var ret = {};
				db.query()
				.select([
					't2.id AS id',
					't2.value AS default_price',
					't2.code AS code'
				], 'products t1')
				.leftJoin('prices t2', 't2.id = t1.price')
				.where('t1.id = ?', [product])
				.run( function(result){
					ret.default_price = result[0].default_price;
					ret.code = result[0].code;
					db.query()
					.select([
						't2.value AS unique_price'
					], 'customers t1')
					.leftJoin('prices_groups t2', 't2.grp = t1.grp')
					.where('t1.id = ? AND t2.price = ?', [customer, result[0].id])
					.run( function(result2){
						ret.unique_price = typeof result2[0] != 'undefined'? result2[0].unique_price: null;
						callback( (ret.unique_price? ret.unique_price: ret.default_price), ret.code );
					});
				});
			}
			var setProducts = function(sale){
				sale.products = [];
				sale.price_count = 0;
				db.query()
				.select([
					't1.product AS id',
					't1.cnt',
					't2.name'
					//'t3.value as price_value'
				], 'sales_detail t1')
				.leftJoin('products t2', 't1.product = t2.id')
				//.leftJoin('prices t3', 't2.price = t3.id')
				.where('t1.sale = ?', [sale.id])
				.run(function(products){
					sale.price_count = 0;
					for( var i = 0; i < products.length; i++ ){
						calcUniquePriceOr( products[i].id, sale.customer, function(value, code){
							products[i].price_value = value;
							products[i].price_code = code;
							sale.price_count+= value * products[i].cnt;							
						});
					}
					sale.products = products;
				});
			}
			db.query()
			.select([
				't1.id',
				't1.customer',
				't1.description',
				't1.date',
				't1.customer',
				't2.name AS customer_name',
				't2.code AS customer_code'
			], 'sales t1')
			.leftJoin('customers t2', 't1.customer = t2.id')
			.where( 't1.id ' + (data.id!==false? ('= '+data.id): '> 0') + (data.search? ' AND (t2.code = \'' + data.search + '\' OR t1.date LIKE \''+ data.search.substr(0,4) + '%\' OR t1.id = \''+ data.search.substr(4) + '\'OR t2.name LIKE \'%'+ data.search + '%\' OR t2.code = \''+ data.search + '\')':''))
			.run(function(result){
				result.forEach( function(val,index){
					result[index].products = [];
					setProducts( result[index] );
				} );
				callback(false, result);
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('sales-set', function(data, callback){
 		try{
			if( typeof data.id != 'undefined' && data.id == 'new' )
				delete data.id;
			delete data.customer_name;
			delete data.customer_code;
			delete data.price_count;
			for( var i = 0; i < data.products.length; i++ )
				delete data.products[i].$$hashKey;
			
			var setProduct = function( product, minus ){
				minus = typeof minus == 'undefined'? false: minus;
				db.query()
				.insert('sales_detail', product )
				.run();
				if( !minus ) return;
				db.query()
				.select('*','products')
				.where('id = ?', [product.product])
				.run(function(result){
					result[0].cnt-= product.cnt;
					db.query()
					.update('products', result[0])
					.where('id = ?', [result[0].id])
					.run();
				});
			}
			var setProducts = function( sale, products, minus ){
				minus = typeof minus == 'undefined'? false: minus;
				for( var i = 0; i < products.length; i++ )
					setProduct( {
						sale: sale,
						product: products[i].id,
						cnt: products[i].cnt
					}, minus );
			}	
			var sale = {
				customer: data.customer,
				description: data.description || '',
				date: data.date || 2345
			}
			if( typeof data.id != 'undefined' ){
				db.query()
				.delete('sales_detail')
				.where('sale = ?', [data.id] )
				.run(function(){
					db.query()
					.update( 'sales', sale )
					.where( 'id = ?', [	data.id ] )
					.run( function(){
						setProducts( data.id, data.products, false );
					});
				});
			}
			else{
				db.query()
				.insert( 'sales', sale )
				.run( function(){
					db.query()
					.select('MAX(id) AS saleId', 'sales')
					.run( function( result ){
						setProducts( result[0].saleId, data.products, true );
					});
				});
			}

			callback( false, true );

		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	.on('sales-del', function(data, callback){
		try{
			db.query()
			.delete('sales')
			.where('id = ?', [data.id])
			.run(function(result){
				db.query()
				.delete('sales_detail')
				.where('sale = ?', [data.id])
				.run(function(result2){
					callback(false, result2);
				});
			});
		}
		catch(err){
			console.log(err);
			callback(true, err);
		}
	})
	
});

	
});



