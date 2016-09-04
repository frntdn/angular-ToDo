//Сортировка по критерию выполнено/невыполнено
(function(){

	'use strict';

	angular.module("myApp")
			.filter("sortTodos", sortTodos);
			
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
	
})();
