var _ = typeof require == 'function' ? require("lodash") : _;

(function(chUtils) {
    /********************************************************************
     * 		WRITE ALL COMMON CODE HERE
     * 		=============================================================
     *
     * Assume chUtils be the this Object. All functions you define within 
     * this are available in server as well as client code.
     ********************************************************************/

    // CONFIG VARS
    chUtils.memcacheHost = "localhost";

    chUtils.test = function() {
        console.log("Just me");

    };
    chUtils.getPreviewData = function(data){

    var finalData = {};
    var totalAmount = 0;
    var afterDTA =0;

    finalData.uniqueUsers =_.unique(data, 'userId').length;
    var uniqueLocation = _.unique(data, 'locationOfService.name');
    finalData.orderLocations = uniqueLocation.length;
    _.each(data, function(item) {
      if (item.billAmount && item.finalAmount)
      {
        totalAmount = parseInt(totalAmount) + parseInt(item.billAmount);
                 afterDTA =  parseInt(afterDTA) + parseInt(item.finalAmount);
             }
    }, 0);

    finalData.totalAmount = totalAmount;
    finalData.afterDTA = afterDTA;
    finalData.discountAmount = parseInt(totalAmount) - parseInt(afterDTA);
return finalData;
    };
    chUtils.callDiscount = function(actualAmount, discount, discountType) {
        var afterDiscount = "";

        if (discountType == "%") {
           // afterDiscount = chUtils.perfectValue(actualAmount - (actualAmount * discount / 100));
            afterDiscount = chUtils.perfectValue(actualAmount * discount / 100);

        }
        if (discountType == "Flat") {
           // afterDiscount = chUtils.perfectValue(actualAmount - discount);
            afterDiscount = chUtils.perfectValue(discount);

        }
        return afterDiscount;

    };
    chUtils.perfectValue = function(value) {

        if (value < 0) {
            return 0;
        } else {
            return value.toFixed(2);
        }
    };

    chUtils.toIsoString = function(str) {
        var date = new Date();
        if (str) {
            date = new Date(str);
            return date.toISOString();
        } else {
            return date.toISOString();
        }
    };

    chUtils.getHoursByDate = function(date) {
        if (date !== undefined && date !== null) {
            var hoursByDate = new Date(date);
            return hoursByDate.getHours();
        }
    };
    chUtils.getMinutesByDate = function(date) {
        if (date !== undefined && date !== null) {
            var hoursByDate = new Date(date);
            return hoursByDate.getMinutes();
        }
    };

    //getYMD returns date format in YYYY-MM-DD
    chUtils.getYMD = function(date){
        if(date!==undefined && date!==null){
            var mydate =  new Date(date);
            return mydate.getFullYear() + "-" + ('0' + (mydate.getMonth() + 1)).slice(-2) + "-" + ('0' + mydate.getDate()).slice(-2);
        }
    };

  //getYMDbyIsoDate returns date format in YYYY-MM-DD : HH
    chUtils.getYMDbyIsoDate = function(date){
        if(date!==undefined && date!==null){
            var mydate =  new Date(date);
            return mydate.getFullYear() + "-" + ('0' + (mydate.getMonth() + 1)).slice(-2) + "-" + ('0' + mydate.getDate()).slice(-2);
        }
    };

     /**
      * This is for checking empty or null 
      * @parmas pass object or string
      * returns true if it is empty 
      */

    chUtils.isEmpty = function(ostr){
        //ostr means object or string
        if(ostr===undefined || ostr===null || ostr=="" || (ostr.trim()).length<0){
            return true;
        }else{
            return false;
        }
    };

    /**
      *This method is used to get all schemes by scheme name
      *@params schemeName , allschemes data   
      *@reult schme object which matches scheme name
      */
    chUtils.getSchemeByName = function(schemes,sName){
       var item =  _.find(schemes, function(item) {
            return item.metadata.name == sName; 
        });
       if(chUtils.isEmpty(item)===false){
         return item;
       }
    };

    /**
      *This method is used to get all schemes by scheme type
      *@params scheme type , allschemes data   
      *@result array of objects matched to scheme type
      */
    chUtils.getSchemesByType = function(allSchemes,type){
      var items = _.filter(allSchemes, function(item){return item.metadata.type == type ? item : false;});

       if(chUtils.isEmpty(items)===false){
         return items;
       }
    };

    /** 
      *This method is used to get all values with key based from objects
      *@params object , required key, required , any array of objects
      *@result returns passed array and sets passed key as an array
      */
    chUtils.pluckObjByName = function(schemeObj,schemeKey){
         schemeObj.forEach(function(val, key) {
            if (val.services!==undefined && val.services.length>0) {
                schemeObj[key].manipulateValues = val.services;
                schemeObj[key][schemeKey] = _.pluck(schemeObj[key].manipulateValues, 'name');
                delete schemeObj[key].manipulateValues;
            } else {
                schemeObj[key][schemeKey] = [];
            }
        });
    };

    /**
      *This method is used to disable all the form fields 
      *@params scheme status (Published or not)
      */
    chUtils.disableInputs = function(schemeStatus,formId){
        if(formId!==null && formId!==undefined){
          var inputElements = document.getElementById(formId).elements;
          if(schemeStatus){
            for(el in inputElements){
                inputElements[el].readOnly  = true;
            }
          }else{
            for(el in inputElements){
              inputElements[el].readOnly  = false;
            }
          }
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
            element.className = element.className.replace(new RegExp('(?:^|\\s)' + cName + '(?!\\S)'), '');
        }
    };


    chUtils.arrayEquals = function(a1, a2) {
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

    chUtils.roundToZero = function(n) {
        return Math.max(0, n);
    };

    //console.log(chUtils);

})(typeof chUtils === 'undefined' ? this.chUtils = {} : chUtils);