// Главный контроллер
(function(){

    angular.module("myApp")
            .controller('mainCtrl', mainCtrl);

            mainCtrl.$inject = ['$scope', '$http', '$window', '$filter', 'dataService', 'baseUrl'];

            function mainCtrl($scope, $http, $window, $filter, dataService, baseUrl) {

                var promiseObj = dataService.getData();

                promiseObj.then( function( data ){

                    // console.log('SUCCESS first request');
                    if ( data === null ) {
                     return $scope.list = [];    
                    } 

                    $scope.list = data[0];
                }, function( error ){
                    console.log('ERROR first request');
                    $window.alert( error );
                });

                //Переменная для ng-if
                $scope.state = true;
                $scope.sortState = 'All';
                $scope.sortWorkerState = 'All';
                //Редактируемый объект
                $scope.editedItem = null;
                //Копия редактируемого/удаляемого объекта
                $scope.currentItem = null;


                $scope.update = function(indexOfItem){
                	//indexOfItem если удаляем элемент.
                	if ( indexOfItem ) {

                		$scope.list.splice(indexOfItem, 1);

                	}

                    var promiseObj = dataService.putData( $scope.list );

                    promiseObj.then( function( data ){
                        // $scope.list = data;
                        $scope.editedItem = null;
                        $scope.currentItem = null;
                    }, function( error ){
                        $scope.list.push($scope.currentItem);
                        $scope.editedItem = null;
                        $scope.currentItem = null;
                        $window.alert('Не получилось удалить, try later.', error);
                    });

                }

                $scope.showModal = function(){

                	$scope.state = false;

                }

                $scope.closedModal = function(){

                	if ( $scope.currentItem === null ) {

                		$scope.editedItem = null;
                		$scope.state = true

                	} else {

                		if ( $scope.editedItem.text != $scope.currentItem.text || $scope.editedItem.date != $scope.currentItem.date ) {

                			$scope.editedItem.text = $scope.currentItem.text;
                			$scope.editedItem.date = $scope.currentItem.date;

                		}

                		$scope.editedItem = null;
            			$scope.currentItem = null;
            			$scope.state = true;
                	}
                	
                }

                $scope.addItem = function( text, date ) {

                	$scope.editedItem = this.editedItem;

                    function isValiditem(){

                        return ( $scope.currentItem === null && $scope.editedItem.text !== "" && $scope.editedItem.date !== '' );
                    
                    }

                    if ( isValiditem () ) {

                        $scope.list.push( { text: $scope.editedItem.text, date: $scope.editedItem.date, worker: $scope.editedItem.worker, done: false } );
                        $scope.state = true;
                        $scope.update();

                    } else {

                	    $scope.editedItem = null;
            			$scope.currentItem = null;
                        $scope.state = true

                    }

                }

                $scope.updateItem = function( item ){

            		$scope.state = false;
                	$scope.editedItem = item;
                	$scope.currentItem = angular.copy( item );

                }

                $scope.deleteItem = function( item ){

              	 	if ( $window.confirm('Удалить?') ) {

              	 		indexOfItem = $scope.list.indexOf(item);
              	 		$scope.currentItem = angular.copy(item);
              	 		$scope.update(indexOfItem);

              	 	}
                }

                $scope.setSortState = function(sortState){

                	$scope.sortState = sortState;
                }

                $scope.isDoneItem = function(item) {

                    $scope.editedItem = item;
                    $scope.currentItem = angular.copy( item );
                    $scope.update();

                }
            };

})();