angular.module('app.services', ['btford.socket-io'])
.factory('$server', function(socketFactory) {
	return socketFactory({
		ioSocket: io.connect('http://127.0.0.1:1362', { query: 'session=' + '' })
	});
})
.factory('$customers', function($server) {
	var self = {};
	self.items = [];
	
	self.get = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( id == 'new' ){
			callback({});
		}
		else{
			$server.emit('customers-get', {id: id}, function(err,result){
				callback(result[0]);
			});
		}
	}
	self.set = function(item, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		item.code = item.code? item.code: '';
		item.description = item.description? item.description: '';
		$server.emit('customers-set', item, function(err, result){
			alert( 'آیتم '+(item.id? '#'+item.id: 'جدید')+' با موفقیت ثبت شد!');
			callback();
		});
	}
	self.del = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( !confirm('آیا از حذف آیتم #'+ id+ ' مطمئن هستید؟ در این صورت ردپای این آیتم از تمامی فهرست‌ها و تاریخچه برنامه حذف خواهد شد.') ) return;
		$server.emit('customers-del', {id: id}, function(err, result){
			alert( 'آیتم #'+id+' با موفقیت حذف شد.' );
			callback();
		});
	}
	self.reload = function(callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('customers-get', {}, function(err,result){
			self.items = result;
			callback(result);
		});
	}
	return self;
})
.factory('$groups', function($server) {
	var self = {};
	self.items = [];
	
	self.get = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( id == 'new' ){
			callback({});
		}
		else{
			$server.emit('groups-get', {id: id}, function(err,result){
				callback(result[0]);
			});
		}
	}
	self.set = function(item, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		item.description = item.description? item.description: '';
		$server.emit('groups-set', item, function(err, result){
			alert( 'آیتم '+(item.id? '#'+item.id: 'جدید')+' با موفقیت ثبت شد!');
			callback();
		});
	}
	self.del = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( !confirm('آیا از حذف آیتم #'+ id+ ' مطمئن هستید؟ در این صورت ردپای این آیتم از تمامی فهرست‌ها و تاریخچه برنامه حذف خواهد شد.') ) return;
		$server.emit('groups-del', {id: id}, function(err, result){
			alert( 'آیتم #'+id+' با موفقیت حذف شد.' );
			callback();
		});
	}
	self.reload = function(callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('groups-get', {}, function(err,result){
			self.items = result;
			callback(result);
		});
	}
	return self;
})
.factory('$prices', function($server) {
	var self = {};
	self.items = [];
	
	self.get = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( id == 'new' ){
			callback({});
		}
		else{
			$server.emit('prices-get', {id: id}, function(err,result){
				callback(result[0]);
			});
		}
	}
	self.set = function(item, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('prices-set', item, function(err, result){
			alert( 'آیتم '+(item.id? '#'+item.id: 'جدید')+' با موفقیت ثبت شد!');
			callback();
		});
	}
	self.del = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( !confirm('آیا از حذف آیتم #'+ id+ ' مطمئن هستید؟ در این صورت ردپای این آیتم از تمامی فهرست‌ها و تاریخچه برنامه حذف خواهد شد.') ) return;
		$server.emit('prices-del', {id: id}, function(err, result){
			alert( 'آیتم #'+id+' با موفقیت حذف شد.' );
			callback();
		});
	}
	self.reload = function(callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('prices-get', {}, function(err,result){
			self.items = result;
			callback(result);
		});
	}
	return self;
})
.factory('$products', function($server) {
	var self = {};
	self.items = [];
	
	self.get = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( id == 'new' ){
			callback({});
		}
		else{
			$server.emit('products-get', {id: id}, function(err,result){
				callback(result[0]);
			});
		}
	}
	self.set = function(item, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		item.description = item.description? item.description: '';
		$server.emit('products-set', item, function(err, result){
			alert( 'آیتم '+(item.id? '#'+item.id: 'جدید')+' با موفقیت ثبت شد!');
			callback();
		});
	}
	self.del = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( !confirm('آیا از حذف آیتم #'+ id+ ' مطمئن هستید؟ در این صورت ردپای این آیتم از تمامی فهرست‌ها و تاریخچه برنامه حذف خواهد شد.') ) return;
		$server.emit('products-del', {id: id}, function(err, result){
			alert( 'آیتم #'+id+' با موفقیت حذف شد.' );
			callback();
		});
	}
	self.reload = function(callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('products-get', {}, function(err,result){
			self.items = result;
			callback(result);
		});
	}
	return self;
})
.factory('$sales', function($server) {
	var self = {};
	self.items = [];
	
	self.get = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( id == 'new' ){
			callback({});
		}
		else{
			$server.emit('sales-get', {id: id}, function(err,result){
				callback(result[0]);
			});
		}
	}
	self.set = function(item, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		item.description = item.description? item.description: '';
		if( typeof item.id != 'undefined' && item.id != 'new' ){
			if( !confirm('توجه داشته باشید که با ویرایش این فاکتور، در موجودی انبار محصولات تغییری داده نخواهد شد. آیا می‌خواهید ادامه دهید؟') ) return;
		}
		else{
			if( !confirm('توجه داشته باشید که با ایجاد این فاکتور، مجموع تعداد محصولات وارد شده از انبار آنها کسر خواهد شد. آیا می‌خواهید ادامه دهید؟') ) return;
		}
		$server.emit('sales-set', item, function(err, result){
			alert( 'آیتم '+(item.id? '#'+item.id: 'جدید')+' با موفقیت ثبت شد!');
			callback();
		});
	}
	self.del = function(id, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		if( !confirm('آیا از حذف آیتم #'+ id+ ' مطمئن هستید؟ در این صورت ردپای این آیتم از تمامی فهرست‌ها و تاریخچه برنامه حذف خواهد شد.\nتوجه داشته باشید که با حذف این فاکتور، در موجودی انبار محصولات تغییری داده نخواهد شد.') ) return;
		$server.emit('sales-del', {id: id}, function(err, result){
			alert( 'آیتم #'+id+' با موفقیت حذف شد.' );
			callback();
		});
	}
	self.reload = function(callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('sales-get', {}, function(err,result){
			self.items = result;
			callback(result);
		});
	}
	self.search = function(text, callback){
		callback = typeof callback == 'undefined'? new Function(): callback;
		$server.emit('sales-get', {search: text}, function(err,result){
			callback(result);
		});
	}
	return self;
})
.factory('$app', function(){
	return {
		windowTitle: 'Alephba Print',
		title: 'الفبای چاپ',
		description: 'برنامه مدیریت مشتری',
		icon: 'thumbs-up-alt'
	}
})
.provider('$views', function(){
	this.$get = function(){
		var ret = {};
		ret.items =  [
			{
				visible: true,
				name: 'customers',
				href: '/customers',
				title: 'مشتری‌ها',
				description: 'مدیریت مشتری‌ها در این قسمت صورت می‌گیرد.',
				icon: 'address-book',
				route: {
					templateUrl: './templates/customers.html',
					controller: 'CustomersCtrl'
				}
			},
			{
				visible: false,
				name: 'customer',
				href: '/customers/:id',
				title: 'مشتری',
				description: '',
				icon: 'address-book',
				route: {
					templateUrl: './templates/customer.html',
					controller: 'CustomerCtrl'
				}
			},
			{
				visible: true,
				name: 'groups',
				href: '/groups',
				title: 'گروه‌ها',
				description: 'مدیریت گروه‌ها در این قسمت صورت می‌گیرد.',
				icon: 'users',
				route: {
					templateUrl: './templates/groups.html',
					controller: 'GroupsCtrl'
				}
			},
			{
				visible: false,
				name: 'group',
				href: '/groups/:id',
				title: 'گروه',
				description: '',
				icon: 'users',
				route: {
					templateUrl: './templates/group.html',
					controller: 'GroupCtrl'
				}
			},
			{
				visible: true,
				name: 'prices',
				href: '/prices',
				title: 'قیمت‌ها',
				description: 'مدیریت قیمت‌ها در این قسمت صورت می‌گیرد.',
				icon: 'dollar',
				route: {
					templateUrl: './templates/prices.html',
					controller: 'PricesCtrl'
				}
			},
			{
				visible: false,
				name: 'price',
				href: '/prices/:id',
				title: 'قیمت',
				description: '',
				icon: 'dollar',
				route: {
					templateUrl: './templates/price.html',
					controller: 'PriceCtrl'
				}
			},
			{
				visible: true,
				name: 'products',
				href: '/products',
				title: 'محصولات',
				description: 'مدیریت محصولات در این قسمت صورت می‌گیرد.',
				icon: 'list-alt',
				route: {
					templateUrl: './templates/products.html',
					controller: 'ProductsCtrl'
				}
			},
			{
				visible: false,
				name: 'product',
				href: '/products/:id',
				title: 'محصول',
				description: '',
				icon: 'list-alt',
				route: {
					templateUrl: './templates/product.html',
					controller: 'ProductCtrl'
				}
			},
			{
				visible: true,
				name: 'sales',
				href: '/sales',
				title: 'فروش‌ها',
				description: 'مدیریت فروش‌ها در این قسمت صورت می‌گیرد.',
				icon: 'basket',
				route: {
					templateUrl: './templates/sales.html',
					controller: 'SalesCtrl'
				}
			},
			{
				visible: false,
				name: 'sale',
				href: '/sales/:id',
				title: 'فروش',
				description: '',
				icon: 'basket',
				route: {
					templateUrl: './templates/sale.html',
					controller: 'SaleCtrl'
				}
			}
		];
		ret.find = function(name){
			for( var i in ret.items )
				if( ret.items[i].name == name )
					return ret.items[i];
		}
		ret.change = function(name, field, value){
			for( var i in ret.items )
				if( ret.items[i].name == name )
					ret.items[i][field] = value;
		}
		return ret;
	}
})
