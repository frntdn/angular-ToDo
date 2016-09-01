var app = angular.module("app", []);
	app.constant("baseUrl", "https://todo-angular-34477.firebaseio.com/items.json");
    app.factory('dataService',  dataService);
    app.controller("mainCtrl", mainCtrl);
    app.directive("tbodyDirective", tbodyDirective);
    app.filter('sortTodos', sortTodos);
    app.filter('sortWorker', sortWorker);

    function dataService($http, $q){
        return {

            getData: function(method, baseUrl, data){
                
                var deffered = $q.defer();

                $http({ 
                    method: method,
                    url: baseUrl,
                    data: data || null
                })
                .success(function(data, status, headers, config){
                    deffered.resolve(data);
                })
                .error(function(error){
                    deffered.reject(error);
                });

                return deffered.promise;
            }
        }
    }

    function tbodyDirective($timeout){
    	return {

    		link: function(scope, element, attrs){

    			var itemToView = attrs["tbodyDirective"];
                var itemsPage = 1;
                var allPages;

                var btn = angular.element('<button>');
                btn.css("margin", "0 auto");
                btn.css("display", "block");
                btn.css("width", "20%");

                btn.addClass('btn btn-default');
                btn.text('Показать еще...');
                element.parent().parent().append(btn);

    			scope.$watch('list', function(newValue, oldValue) {
                    
                    if ( scope.list !== undefined ) {
                        //Начальное значение чтобы вывести
                        allPages = Math.ceil(scope.list.length / itemToView);
                        
                        scope.filtredArr = newValue.slice(0, itemToView * itemsPage);
                        
                        itemspage = 1;
                    }

    			});

                btn.on('click', function(e){
                    
                    ++itemsPage;

                    //Вычисляем следующее значение, которое произойдёт по клику
                    scope.filtredArr = scope.list.slice(0, itemToView * itemsPage);
                    scope.$digest();

                    if ( itemsPage >= allPages) {
                        btn.css('display', 'none');
                    }

                });

    		},
    		restrict: "A"
    	}
    }

    function sortWorker(){
    	return function(items, state){
    		switch(state){
    			case 'All': return items;
    			case state: return items.filter( ( item ) => { return item.worker == state; });
    			default: return items;
    		}
    	}
    }

    function sortTodos(){

    	return function(items, state){
	    	switch(state){
	    		case 'All': return items;
	    		case 'Done': return items.filter( ( item ) => { return item.done == true; });
	    		case 'Undone': return items.filter( ( item ) => { return item.done == false; });
	    		default: return items;
	    	}
    	}
    }
    
    function mainCtrl($scope, baseUrl, $http, $window, $filter, dataService) {

    if ( sessionStorage.getItem('todos') ){

        $scope.list = JSON.parse( sessionStorage.getItem('todos') );

    } else {

        var promiseObj = dataService.getData('GET', baseUrl);

        promiseObj.then( function( data ){

            console.log('SUCCESS request');

            if ( data == null ) {
             return $scope.list = [];    
            } 

            $scope.list = data;
            sessionStorage.setItem('todos', JSON.stringify(data) );

        }, function( error ){

            console.log('ERROR request');
            $window.alert( error );

        });
         
    }

    //Переменная для ng-if
    $scope.state = true;
    $scope.sortState = 'All';
    $scope.sortWorkerState = 'All';
    //Редактроемый объект
    $scope.editedItem = null;
    //Копия редактируемого объекта
    $scope.currentItem = null;

    $scope.update = function(indexOfItem){
    	
    	if ( indexOfItem ) {

    		$scope.list.splice(indexOfItem, 1);

    	}
    		
    	$http({
    		method: 'PUT',
    		url: baseUrl,
    		data: $scope.list
    	}).then(function successCallback(response) {
		    console.log('SUCCESS');
		    // console.log(response);
		    $scope.list = response.data;
		    sessionStorage.setItem('todos', JSON.stringify(response.data) );
		    
		    $scope.currentItem = null;
	 	}, function errorCallback(response) {
	  	 	console.log('ERROR');
	  	 	// console.log(response.error);
	  	 	
	  	 	if ( indexOfItem ) {
	  	 		$scope.list.push($scope.currentItem);
	  	 		$scope.currentItem = null;
	  	 	}
	  	 		
	  	 	$window.alert('Не получилось удалить, try later.');
	 	});

    }

    $scope.showModal = function(){

    	$scope.state = false;

    }

    $scope.closedModal = function(){

    	if ( $scope.currentItem == null ) {

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
    	// console.log(this.editedItem);
    	$scope.editedItem = this.editedItem;

        if ( $scope.currentItem == null && $scope.editedItem.text != "" && $scope.editedItem.date != '' ) {

            $scope.list.push( { text: $scope.editedItem.text, date: $scope.editedItem.date, worker: $scope.editedItem.worker, done: false } );

        } else {

        	// console.log( 'err' );
    	    $scope.editedItem = null;
			$scope.currentItem = null;

        }

        $scope.state = true;
        $scope.editedItem = null;
        $scope.update();
    }

    $scope.updateItem = function( item ){

		$scope.state = false;
    	$scope.editedItem = item;
    	$scope.currentItem = angular.copy( item );

    }

    $scope.deleteItem = function( item ){

  	 	var deleteitem = $window.confirm( 'Удалить?' );

  	 	if ( deleteitem ) {
  	 		indexOfItem = $scope.list.indexOf(item);
  	 		$scope.currentItem = angular.copy(item);
  	 		$scope.update(indexOfItem);
  	 	}
    }

    $scope.setSortState = function(sortState){
    	// console.log(sortState);
    	$scope.sortState = sortState;
    }
};