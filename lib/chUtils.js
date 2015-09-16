(function(chUtils) {
/********************************************************************
 * 		WRITE ALL COMMON CODE HERE
 * 		=============================================================
 *
 * Assume chUtils be the this Object. All functions you define within 
 * this are available in server as well as client code.
 ********************************************************************/

    // CONFIG VARS
    chUtils.memcacheHost = "localhost",

	chUtils.test = function() {
		console.log("Just me");

	};

    chUtils.toIsoString = function(str){
        var date = new Date();
            if(str){
                date = new Date(str);
                return date.toISOString();
            }else{
                return date.toISOString();
            }
    };

    chUtils.resetForm = function(formId){
        if(formId){
            document.getElementById(formId).reset();
        }
    };
    chUtils.addClass = function(element, cName) {
            if (element) {
                if (element.className.length > 0) {
                    element.className += ' ';
                }
                element.className += cName;
            }
        };
    chUtils.removeClass = function(element, cName) {
        if (element) {
            element.className = element.className.replace(new RegExp('(?:^|\\s)'+cName+'(?!\\S)'), '');
        }
    };


	chUtils.arrayEquals = function(a1,a2){
     if (!a1 || !a2)
         return false;
     if (a1.length != a2.length)
         return false;
     for (var i = 0, l = a1.length; i < l; i++) {
         if (a1[i] instanceof Array && a2[i] instanceof Array) {
             if (!a1[i].equals(a2[i]))
                 return false;
         } else if (a1[i] != a2[i]) {
             return false;
         }
     }
     return true;
	};

	chUtils.roundToZero = function(n){
		return Math.max(0, n);
	};

})(typeof chUtils === 'undefined' ? this.chUtils = {} : chUtils);