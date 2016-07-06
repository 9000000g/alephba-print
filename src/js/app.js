var app = angular.module('app', ['ngNaiFramework', 'app.services', 'app.controllers'])

.config(function($routeProvider, $viewsProvider) {
/* 	var views = $viewsProvider.$get().items;
	for( var i = 0; i < views.length; i++ )
		$routeProvider.when(views[i].href, views[i].route); */
	$routeProvider
	.when('/main', {
		templateUrl: 'templates/main.html',
		controller: 'MainCtrl'
	})
	.when('/customers', {
		templateUrl: 'templates/customers.html',
		controller: 'CustomersCtrl'
	})
	.when('/customers/:id', {
		templateUrl: 'templates/customer.html',
		controller: 'CustomerCtrl'
	})
	.when('/groups', {
		templateUrl: 'templates/groups.html',
		controller: 'GroupsCtrl'
	})
	.when('/groups/:id', {
		templateUrl: 'templates/group.html',
		controller: 'GroupCtrl'
	})
	.when('/products', {
		templateUrl: 'templates/products.html',
		controller: 'ProductsCtrl'
	})
	.when('/products/:id', {
		templateUrl: 'templates/product.html',
		controller: 'ProductCtrl'
	})
	.when('/prices', {
		templateUrl: 'templates/prices.html',
		controller: 'PricesCtrl'
	})
	.when('/prices/:id', {
		templateUrl: 'templates/price.html',
		controller: 'PriceCtrl'
	})
	.when('/sales', {
		templateUrl: 'templates/sales.html',
		controller: 'SalesCtrl'
	})
	.when('/sales/:id', {
		templateUrl: 'templates/sale.html',
		controller: 'SaleCtrl'
	})
	.when('/print/:id', {
		templateUrl: 'templates/print.html',
		controller: 'PrintCtrl'
	})
	.when('/select', {
		templateUrl: 'templates/select.html',
		controller: 'SelectCtrl'
	})
	.when('/report-price-count', {
		templateUrl: 'templates/report-price-count.html',
		controller: 'ReportPriceCountCtrl'
	})
	$routeProvider.otherwise({redirectTo: '/select'});

})
;
