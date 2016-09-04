// Сервис для получения и отправки данных на сервер
(function(){

	'use strict';

	angular.module("myApp")
			.service('requestHandler',  requestHandler);

			requestHandler.$inject = ['$http', '$q'];

		    function requestHandler($http, $q){

		        return function(method, baseUrl, data){

		            // console.log(method);
		            // console.log(baseUrl);
		            // console.log(data);

		            var deffered = $q.defer();

		                $http({ 
		                    method: method,
		                    url: baseUrl,
		                    data: data || null
		                })
		                .success( function( data, status, headers, config ){
		                    deffered.resolve(data);
		                })
		                .error( function( error ){
		                    deffered.reject(error);
		                });

		            return deffered.promise;
		        }
		    }

})();
