angular.module('ngNaiFramework', ['ngRoute','ngAnimate','ngTouch','ng-selectize', 'ngJalaaliFlatDatepicker', 'uiSwitch', 'LocalStorageModule'])
.directive('sidebar', function($timeout) {
	return {
		restrict: 'E',
		replace: 'true',
		transclude: true,
		scope: {
			myOpen: '=open',
			direction: '@'
		},
        link: function(scope) {
			scope.direction = typeof scope.direction == 'string'? scope.direction: 'left';
        },
		template: ''+
		'<div>'+
		'	<div class="nai-overlay toggle" ng-show="myOpen" ng-click="myOpen = false"></div>'+
		'	<div class="nai-sidebar col-md-3 col-sm-5 col-xs-8 slide-left" ng-show="myOpen" ng-class="direction" ng-transclude></div>'+
		'</div>'
	};
})
.directive('searchbar', function($timeout) {
	return {
		restrict: 'E',
		replace: 'true',
		transclude: false,
		scope: {
			myOpen: '=open',
			placeholder: '@',
			callback: '&callback'
		},
        link: function(scope, element) {
			scope.placeholder = typeof scope.placeholder == 'string'? scope.placeholder: 'متن جست‌وجو را وارد کنید...';
			scope.searchText = '';
			scope.myCallback = function(){
				if( scope.callback( {$text: scope.searchText} ) !== false )
					scope.myOpen = false;
			}
			scope.$watch( 'myOpen', function(newVal){
				a = (element);
				if( newVal == true ){
					scope.searchText = '';
					$timeout(function() {
						var inp = element.find('input');
						if(inp)
							inp.focus();
					}, 100);
				}
			});
			
        },
		template: ''+
		'<div>'+
		'	<div class="nai-overlay toggle" ng-show="myOpen" ng-click="myOpen = false"></div>'+
		'	<div class="nai-searchbar slide-down" ng-show="myOpen">'+
		'		<form ng-submit="myCallback()">'+
		'			<input type="search" class="form-control input input-sm" placeholder="{{placeholder}}" ng-model="searchText">'+
		'			<span class="nai-nav-icon left glyphicon glyphicon glyphicon glyphicon-chevron-up" ng-click="myOpen = false"></span>'+
		'			<button type="submit" class="nai-nav-icon left glyphicon glyphicon-ok"></button>'+
		'		</form>'+
		'	</div>'+
		'</div>'
	};
})
.directive('icon', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			src: '@'
		},
		template: ''+
		'<i class="icon icon-{{src}}"></i>'
	};
})
.directive('glyphicon', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			src: '@'
		},
		template: ''+
		'<i class="glyphicon glyphicon-{{src}}"></i>'
	};
})
;


