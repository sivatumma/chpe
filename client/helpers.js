/**
  *This method is used to display the value or "?"
  *@params pass string or number
 */

function qDisplay(x) {
	return (typeof x != "number") ? (x.trim() || '?') : x;
}

/**
  *This method is used to return string as an array
  *@params array
  */
function arrayToString(arr){
	return (typeof arr === 'object')?arr.join():("None for this criteria");
}

//check if it is zero

function isZero(x){
	return (typeof x == 'number' && x==0)?100:x;
}

