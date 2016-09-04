//Сортировка по рабочему
(function(){

	'use strict';

	angular.module("myApp")
			.filter("sortWorker", sortWorker);
			
			function sortWorker(){
				
		    	return function(items, state){
		    		switch(state){
		    			case 'All': return items;
		    			case state: return items.filter( ( item ) => { return item.worker == state; });
		    			default: return items;
		    		}
		    	}
		    }
	
})();
