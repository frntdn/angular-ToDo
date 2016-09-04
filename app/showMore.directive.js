//Директива для управления таблицей, кнопка "Показать ещё..."
(function(){

	'use strict';

	angular.module("myApp")
			.directive("showMore", showMore);
	
		function showMore(){
	    	return {

	    		template: '<button class="btn btn-default btn_show-more">Показать еще...</button>',
	    		
	    		link: function(scope, element, attrs){
	    			var btn = element;
	    			var itemToView = 2;
	                var itemsPage = 1;
	                var allPages;

	                function isShowButton(itemsPage, allPages){

	                	if (itemsPage >= allPages) {

	                		btn.css('display', 'none');

	                	} else {

	                		btn.css('display', 'block')

	                	}
	                }

	                btn.on('click', function(e){
	                    
	                    ++itemsPage;

	                    //Вычисляем следующее значение, которое произойдёт по клику
	                    scope.filtredArr = scope.list.slice(0, itemToView * itemsPage);
	                    scope.$digest();

	                    isShowButton( itemsPage, allPages );
	                });

	    			scope.$watch('list', function(newValue, oldValue) {

	                	isShowButton( itemsPage, allPages );

	                    if ( !!newValue ) {

                        	//Условие для первой итерации  
	                        if ( oldValue === undefined ) {
		                        //Начальное значение чтобы вывести
	                        	allPages = Math.ceil(scope.list.length / itemToView);
	                        
	                        	scope.filtredArr = scope.list.slice(0, itemToView * itemsPage);

	                        } else {

	                        	allPages = Math.ceil(newValue.length / itemToView);

	                        	scope.filtredArr = scope.list.slice(0, itemToView * itemsPage);

	                        }

	                    }

	    			}, true);
	    		},

	    		restrict: "EA",

	    		replace: true
	    	}
	    }
	
})();

