angular.module('app.controllers', [])
.run(function($rootScope, $location, $server, $app, $customers, $groups, $prices, $products, $sales){
	$rootScope.$app = $app; $rootScope.loading = false;
	$rootScope.panels = {}; $rootScope.go = function(url){
		//$rootScope.panels.sidebar = false;
		if( url == 'back' )
			$window.history.back();
		else
			$location.url( url );
		return true;
	}
	/* $rootScope.go( '/main' ); */

	$rootScope.alert = alert; $rootScope.exit = function(){
		$server.emit( 'exit' );
	}
	$rootScope.exit = function(){
		$server.emit('exit');
	}
	$rootScope.datepickerConfig = {dateFormat: 'jYYYY-jMM-jDD', allowFuture: true};
	$rootScope.displayPrice = function(val){
		val = typeof val == 'undefined'? 0: val;
		var price = val.toString().split('').reverse().join('');
		var output = '';
		for( var i = 0; i < price.length; i+=3 ){
			output+= price.substr(i, 3) + ( price.substr(i, 3).length == 3 ? ',': '');
		}
		output = output.split('').reverse().join('');
		if( output.substr(0,1) == ',' ){
			output = output.substr(1);
		}
		return output;
	}

})
.controller('MainCtrl', function($scope, $server, $rootScope, $timeout){
	$rootScope.loading = false;

})
.controller('CustomersCtrl', function($scope, $rootScope, $timeout, $server, $customers){
	$rootScope.loading = true;
	$scope.items = [];
	$customers.reload(function(items){
		$scope.items = items;
		$rootScope.loading = false;
	});
})
.controller('CustomerCtrl', function($scope, $rootScope, $timeout, $routeParams, $server, $rootScope, $customers, $groups){
	$rootScope.loading = true;
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$customers.get($routeParams.id, function(item){
			$scope.item = item;
			$rootScope.loading = false;
		});
	}
	else{
		$scope.item = {};
		$rootScope.loading = false;
	}
	$scope.groups = [];
	$groups.reload( function(items){
		$scope.groups = items;
	});


	$scope.id = $routeParams.id;
	$scope.submit = function(){
		$customers.set( $scope.item, function(){
			$rootScope.go('customers', 'customers');
		});
	}
	$scope.delete = function(){
		$customers.del( $scope.item.id, function(){
			$rootScope.go('customers', 'customers');
		});
	}
})

.controller('GroupsCtrl', function($scope, $rootScope, $timeout, $server, $groups){
	$rootScope.loading = true;
	$scope.items = [];
	$groups.reload(function(items){
		$scope.items = items;
		$rootScope.loading = false;
	});
})
.controller('GroupCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $groups){
	$rootScope.loading = true;
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$groups.get($routeParams.id, function(item){
			$scope.item = item;
			$rootScope.loading = false;
		});
	}
	else{
		$scope.item = {};
		$rootScope.loading = false;
	}
	$scope.id = $routeParams.id;
	$scope.submit = function(){
		$groups.set( $scope.item, function(){
			$rootScope.go('groups', 'groups');
		});
	}
	$scope.delete = function(){
		$groups.del( $scope.item.id, function(){
			$rootScope.go('groups', 'groups');
		});
	}
})
.controller('PricesCtrl', function($scope, $rootScope, $timeout, $server, $prices){
	$rootScope.loading = true;
	$scope.items = [];
	$prices.reload(function(items){
		$scope.items = items;
		$rootScope.loading = false;
	});
})
.controller('PriceCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $prices, $groups){
	$rootScope.loading = true;
	$scope.item = {};
	$scope.groups = [];
	$groups.reload(function(items){
		$scope.groups = items;
		if( $routeParams.id != 'new' ){
			$prices.get($routeParams.id, function(item){
				$scope.item = item;
				var j,f;
				for( var i = 0; i < $scope.groups.length; i++ ){
					f = false;
					for( j = 0; j < $scope.item.prices.length; j++ ){
						if( $scope.item.prices[j].grp == $scope.groups[i].id ){
							f = true;
							break;
						}
					}
					if( !f ){
						$scope.item.prices.push( {
							grp: $scope.groups[i].id,
							grp_name: $scope.groups[i].name,
							price: $scope.item.id,
							value: null
						} );
					}
					else{
						$scope.item.prices[j].grp_name = $scope.groups[i].name;
					}
				}
				$rootScope.loading = false;
			});
		}
		else{
			var j,f;
			$scope.item.prices = [];
			for( var i = 0; i < $scope.groups.length; i++ ){
				$scope.item.prices.push( {
					grp: $scope.groups[i].id,
					grp_name: $scope.groups[i].name,
					price: 'new',
					value: ''
				} );
			}
			$rootScope.loading = false;
		}
	});

	$scope.id = $routeParams.id;

	$scope.submit = function(){
		$prices.set( $scope.item, function(){
			$rootScope.go('prices', 'prices');
		});
	}
	$scope.delete = function(){
		$prices.del( $scope.item.id, function(){
			$rootScope.go('prices', 'prices');
		});
	}
})
.controller('ProductsCtrl', function($scope, $timeout, $rootScope, $server, $products){
	$rootScope.loading = true;
	$scope.items = [];
	$scope.totalPrice = 0;
	$scope.calcPrice = function(item){
		return item.price_value * item.cnt;
	}
	$products.reload(function(items){
		$scope.items = items;
		for( var i = 0; i < items.length; i++ ){
			$scope.totalPrice+= $scope.calcPrice( items[i] );
		}
		$rootScope.loading = false;
	});
})
.controller('ProductCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $products, $prices){
	$rootScope.loading = true;
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$products.get($routeParams.id, function(item){
			$scope.item = item;
			$scope.item.cnt = typeof $scope.item.cnt != 'number'? 0: $scope.item.cnt;
			$rootScope.loading = false;
		});
	}
	else{
		$scope.item.cnt = typeof $scope.item.cnt != 'number'? 0: $scope.item.cnt;
		$rootScope.loading = false;
	}
	$scope.prices = [];
	$prices.reload( function(items){
		$scope.prices = items;
	});

	$scope.calcPrice = function(){
		for( var i = 0; i < $scope.prices.length; i++ ){
			if( $scope.prices[i].id == $scope.item.price )
				return $scope.prices[i].value * $scope.item.cnt;
		}
		return 0;
	}

	$scope.id = $routeParams.id;
	$scope.submit = function(){
		$products.set( $scope.item, function(){
			$rootScope.go('products', 'products');
		});
	}
	$scope.delete = function(){
		$products.del( $scope.item.id, function(){
			$rootScope.go('products', 'products');
		});
	}
})
.controller('SalesCtrl', function($scope, $timeout, $server, $sales, $rootScope){
	$rootScope.loading = true;
	$scope.items = [];
	$scope.searchbar = false;
	$scope.searched = false;
	$scope.searchText = '';
	$scope.search = function(text){
		if( text == '' ){
			$scope.searched = false;
			$sales.reload(function(items){
				$scope.items = items;
				//console.log(items);
			});
		}
		else{
			$scope.searchText = text;
			$scope.searched = true;
			$sales.search(text, function(items){
				$scope.items = items;
			});
		}
	}
	$scope.calcFactorCode = function(factor){
		return factor.date.split('-').join().substr(0,4) + factor.id ;
	}
	$sales.reload(function(items){
		$scope.items = items;
		$rootScope.loading = false;
	});
})
.controller('SaleCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $sales, $products, $customers){
	$rootScope.loading = true;
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$sales.get($routeParams.id, function(item){
			$scope.item = item;
			//console.log(item);
			$rootScope.loading = false;
		});
	}
	else{
		$scope.item = {};
		$scope.item.products = [];
		$rootScope.loading = false;
	}
	$scope.products = [];
	$products.reload( function(items){
		$scope.products = items;
	});
	$scope.customers = [];
	$customers.reload( function(items){
		$scope.customers = items;
	});
	$scope.calcTotalCnt = function(product){
		for( var i = 0; i < $scope.products.length; i++ ){
			if( $scope.products[i].id == product )
				return $scope.products[i].cnt;
		}
		return 0;
	}
	$scope.calcFactorCode = function(){
		return $scope.item.id? $scope.item.date.split('-').join().substr(0,4) + $scope.item.id: '' ;
	}

	$scope.id = $routeParams.id;
	$scope.submit = function(){
		$sales.set( $scope.item, function(){
			$rootScope.go('sales');
		});
	}
	$scope.delete = function(){
		$sales.del( $scope.item.id, function(){
			$rootScope.go('sales');
		});
	}
	$scope.print = function(){
		$rootScope.go('print/'+$scope.item.id);
	}
	$scope.addProduct = function(){
		$scope.item.products.push({});
	}
	$scope.removeProduct = function(index){
		$scope.item.products.splice(index,1);
	}
})
.controller('PrintCtrl', function($scope, $sales, $rootScope, $routeParams, $window){
	$rootScope.loading = true;
	$scope.item = {};

	$sales.get($routeParams.id, function(item){
		$scope.item = item;
		$scope.item.code = item.date.split('-').join().substr(0,4) + item.id;
		$scope.item.total_price_value = 0;
		for( var i = 0; i < item.products.length; i++ ){
			$scope.item.total_price_value += (item.products[i].price_value * item.products[i].cnt);
		}
		$rootScope.loading = false;
	});

	$scope.submit = function(){
		$window.print()
	}


})
.controller('SelectCtrl', function($scope, $rootScope, localStorageService, $server){
	$rootScope.loading = true;
	$scope.recentFiles = localStorageService.get('recentFiles');
	$scope.recentFiles = $scope.recentFiles? $scope.recentFiles: [];
	$scope.selectedFile = '';

	$scope.selectFile = function(file){
		file = typeof file == 'undefined'? null: file;
		$server.emit('selectFile', {
			file: file
		}, function(err, result){
			if( !err ){
				$scope.selectedFile = result;
				var index = $scope.recentFiles.indexOf( $scope.selectedFile );
				if( index !== -1 )
					$scope.recentFiles.splice( index, 1 );
				$scope.recentFiles.unshift( $scope.selectedFile );
				localStorageService.set('recentFiles', $scope.recentFiles);
				$rootScope.go('/main');
			}
		});
	}
	$scope.newFile = function(){
		file = typeof file == 'undefined'? null: file;
		$server.emit('newFile', {}, function(err, result){
			if( !err ){
				$scope.selectedFile = result;
				var index = $scope.recentFiles.indexOf( $scope.selectedFile )
				if( index !== -1 )
					$scope.recentFiles.splice( index, 1 );
				$scope.recentFiles.unshift( $scope.selectedFile );
				localStorageService.set('recentFiles', $scope.recentFiles);
				$rootScope.go('/main');
			}
		});
	}
	$scope.clearRecents = function(){
		$scope.recentFiles = [];
		localStorageService.set('recentFiles', []);
	}
	$scope.clearFileFromRecent = function(index){
		$scope.recentFiles.splice( index, 1 );
		localStorageService.set('recentFiles', $scope.recentFiles);
	}
	$rootScope.loading = false;
})
.controller('ReportPriceCountCtrl', function($scope, $sales, $rootScope){
	$rootScope.loading = true;
	$scope.item = {};
	$scope.searchResult = {
		price_count: 0,
		grps: {}
	};
	$scope.searched = false;
	$scope.calc = function(){
		$scope.searched = true;
		$scope.searchResult.price_count = 0;
		for( var i = 0; i < $scope.totalSales.length; i++ ){
			if( $scope.totalSales[i].id >= $scope.item.from && $scope.totalSales[i].id <= $scope.item.to ){
				$scope.searchResult.price_count+=$scope.totalSales[i].price_count;
				if( typeof $scope.searchResult.grps[$scope.totalSales[i].customer_grp] == 'undefined' ){
					$scope.searchResult.grps[$scope.totalSales[i].customer_grp] = {
						name: $scope.totalSales[i].customer_grp_name,
						price_count: 0
					};
				}
				$scope.searchResult.grps[$scope.totalSales[i].customer_grp].price_count += $scope.totalSales[i].price_count;
			}
		}
	}
	$scope.totalSales = [];
	$scope.sales = [];
	$sales.reload(function(items){
		$scope.totalSales = items;
		for( var i = 0; i < items.length; i++ ){
			$scope.sales.push({
				id: items[i].id,
				code: items[i].date.substr(0,4) + '' + items[i].id
			});
		}
		$rootScope.loading = false;
		console.log($scope.totalSales);
	});
})
