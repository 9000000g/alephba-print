angular.module('app.controllers', [])
.run(function($rootScope, $location, $server, $app, $customers, $groups, $prices, $products, $sales){
	$rootScope.$app = $app;
	
	$rootScope.panels = {};
	$rootScope.go = function(url){
		//$rootScope.panels.sidebar = false;
		if( url == 'back' )
			$window.history.back();
		else
			$location.url( url );
		return true;
	}
	/* $rootScope.go( '/main' ); */
	
	$rootScope.alert = alert;
	$rootScope.exit = function(){
		$server.emit( 'exit' );
	}
	$rootScope.exit = function(){
		$server.emit('exit');
	}
	$rootScope.datepickerConfig = {dateFormat: 'jYYYY-jMM-jDD', allowFuture: true};

})
.controller('MainCtrl', function($scope, $server){

})
.controller('CustomersCtrl', function($scope, $timeout, $server, $customers){
	$scope.items = [];
	$customers.reload(function(items){
		$scope.items = items;
	});
})
.controller('CustomerCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $customers, $groups){
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$customers.get($routeParams.id, function(item){
			$scope.item = item;
		});
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

.controller('GroupsCtrl', function($scope, $timeout, $server, $groups){
	$scope.items = [];
	$groups.reload(function(items){
		$scope.items = items;
	});
})
.controller('GroupCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $groups){
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$groups.get($routeParams.id, function(item){
			$scope.item = item;
		});
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
.controller('PricesCtrl', function($scope, $timeout, $server, $prices){
	$scope.items = [];
	$prices.reload(function(items){
		$scope.items = items;
	});
})
.controller('PriceCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $prices, $groups){
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
.controller('ProductsCtrl', function($scope, $timeout, $server, $products){
	$scope.items = [];
	$scope.calcPrice = function(item){
		return item.price_value * item.cnt;
	}
	$products.reload(function(items){
		$scope.items = items;
		console.log(items);
	});
})
.controller('ProductCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $products, $prices){
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$products.get($routeParams.id, function(item){
			$scope.item = item;
			$scope.item.cnt = typeof $scope.item.cnt != 'number'? 0: $scope.item.cnt;
		});
	}
	else{
		$scope.item.cnt = typeof $scope.item.cnt != 'number'? 0: $scope.item.cnt;
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
.controller('SalesCtrl', function($scope, $timeout, $server, $sales){
	$scope.items = [];
	$scope.searchbar = false;
	$scope.searched = false;
	$scope.searchText = '';
	$scope.search = function(text){
		if( text == '' ){
			$scope.searched = false;
			$sales.reload(function(items){
				$scope.items = items;
				console.log(items);
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
		console.log(items);
	});
})
.controller('SaleCtrl', function($scope, $timeout, $routeParams, $server, $rootScope, $sales, $products, $customers){
	
	
	$scope.item = {};
	if( $routeParams.id != 'new' ){
		$rootScope.loading = true;
		$sales.get($routeParams.id, function(item){
			$scope.item = item;
			$rootScope.loading = false;
		});
	}
	else{
		$scope.item = {};
		$scope.item.products = [];
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
			$rootScope.go('sales', 'sales');
		});
	}
	$scope.delete = function(){
		$sales.del( $scope.item.id, function(){
			$rootScope.go('sales', 'sales');
		});
	}
	$scope.print = function(){
		alert('i dont have printer yet');
	}
	$scope.addProduct = function(){
		$scope.item.products.push({});
	}
	$scope.removeProduct = function(index){
		$scope.item.products.splice(index,1);
	}
})
.controller('SelectCtrl', function($scope, $rootScope, localStorageService, $server){
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
	
})
.controller('ReportPriceCountCtrl', function($scope, $sales){
	$scope.item = {};
	$scope.searchResult = {
		price_count: 0
	};
	$scope.searched = false;
	$scope.calc = function(){
		$scope.searched = true;
		$scope.searchResult.price_count = 0;
		for( var i = 0; i < $scope.totalSales.length; i++ ){
			if( $scope.totalSales[i].id >= $scope.item.from && $scope.totalSales[i].id <= $scope.item.to ){
				$scope.searchResult.price_count+=$scope.totalSales[i].price_count;
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
	});
})