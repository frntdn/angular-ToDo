// Фабрика для обработки данных перед/после отправкой(-ки) на сервер
(function(){

	'use strict';

	angular.module("myApp")
			.factory('dataService', dataService);

			dataService.$inject = ['$q', 'requestHandler', 'baseUrl', 'baseUrlWorkers'];

		    function dataService($q, requestHandler, baseUrl, baseUrlWorkers){
		        var vm = this;

		        vm.properties = {
		            todos: null,
		            workers: null
		        };

		        return {
		            getData: function() {
		                if ( vm.properties.todos && vm.properties.workers) {
		                    return $q.all([ $q.when( vm.properties.todos ), $q.when(  vm.properties.workers ) ]);
		                } else {
		                    return $q.all([
		                            requestHandler('GET', baseUrl)
		                            .then( function(data){
		                                vm.properties.todos = data;
		                                return $q.when( data );
		                        }),
		                            requestHandler('GET', baseUrlWorkers)
		                            .then( function(data){
		                                vm.properties.workers = data;
		                                return $q.when( data ); 
		                        })
		                    ]);
		                }
		            },
		            putData: function(data) {
		                return requestHandler('PUT', baseUrl, data)
		                        .then(function(data){
		                            // console.log(data);
		                            vm.properties.todos = data;
		                            return $q.when( data );
		                        });
		            }
		        }
		    }

})();
