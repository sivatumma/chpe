var _ = typeof require == 'function' ? require("lodash") : _;
   var moment = require('moment');
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
  chUtils.setDefaultDate = function(schemeData, orderData) {
    var total = 0;
    var Distotal = 0;
    var week = "1Week";
    var revenues = {};
    var discounts = {};
    var revenues_and_discounts = {};
    var finalData = {};
    var totalAmount = 0;
    var afterDTA = 0;
    var orderDetails = {};
    var schemeDetails = {};

    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (schemeData[0].metadata.type == "COUPON") {
      var startDate = moment(schemeData[0].behavior.startDate.toISOString("DD/MM/YYYY"), 'YYYY-M-DD HH:mm:ss');
      var endDate = moment(schemeData[0].behavior.endDate.toISOString("DD/MM/YYYY"), 'YYYY-M-DD HH:mm:ss');
      var datediff = endDate.diff(startDate, 'days');
      var month = schemeData[0].behavior.startDate.toISOString().substring(5, 7);
      var groupedByMonth = _.groupBy(orderData, function(item) {
        return item.dateOfService.toISOString().substring(5, 10);
      });

      if (datediff <= 7) {
        for (var i = 1; i <= 7; i++) {
          discounts[i + " Day " + monthNames[month - 1]] = 0;
          revenues[i + " Day " + monthNames[month - 1]] = 0;
        }
        _.each(groupedByMonth, function(item, key) {

          var dYearDate = key.split("-");
          _.each(item, function(itemData, DataKey) {
            total = parseInt(total) + parseInt(itemData.billAmount);
            Distotal = parseInt(Distotal) + parseInt(itemData.finalAmount);
          });
          revenues[parseInt(dYearDate[1]) + " Day " + monthNames[dYearDate[0] - 1]] = revenues[parseInt(dYearDate[1]) + " Day " + monthNames[dYearDate[0] - 1]] + total;
          discounts[parseInt(dYearDate[1]) + " Day " + monthNames[dYearDate[0] - 1]] = discounts[parseInt(dYearDate[1]) + " Day " + monthNames[dYearDate[0] - 1]] + Distotal;
          total = 0;
          Distotal = 0;
        });
        revenues_and_discounts = {
          revenues: revenues,
          discounts: discounts
        };
        _.each(revenues_and_discounts.revenues, function(item, key) {
          revenues_and_discounts.discounts[key] = revenues[key] - revenues_and_discounts.discounts[key];
        });
      } else {

        for (var i = 1; i <= 5; i++) {
          discounts[i + " Week " + monthNames[month - 1]] = 0;
          revenues[i + " Week " + monthNames[month - 1]] = 0;
        }
        _.each(groupedByMonth, function(item, key) {

          var dYearDate = key.split("-");
          _.each(item, function(itemData, DataKey) {

            total = parseInt(total) + parseInt(itemData.billAmount);
            Distotal = parseInt(Distotal) + parseInt(itemData.finalAmount);

          });

          if (dYearDate[1] <= 7) {
            week = "1 Week ";
          } else if (dYearDate[1] <= 14) {
            week = "2 Week ";
          } else if (dYearDate[1] <= 21) {
            week = "3 Week ";
          } else if (dYearDate[1] <= 28) {
            week = "4 Week ";
          } else {
            week = "5 Week ";
          }
          revenues[week + monthNames[dYearDate[0] - 1]] = revenues[week + monthNames[dYearDate[0] - 1]] + total;
          discounts[week + monthNames[dYearDate[0] - 1]] = discounts[week + monthNames[dYearDate[0] - 1]] + Distotal;
          total = 0;
          Distotal = 0;
        });

        revenues_and_discounts = {
          revenues: revenues,
          discounts: discounts
        };
        _.each(revenues_and_discounts.revenues, function(item, key) {
          revenues_and_discounts.discounts[key] = revenues[key] - revenues_and_discounts.discounts[key];
        });
      }
    } else {
      var groupedByMonth = _.groupBy(orderData, function(item) {
        return item.dateOfService.toISOString().substring(0, 7);
      });
      var year = schemeData[0].behavior.startDate.toISOString().substring(0, 4);
      var month = schemeData[0].behavior.startDate.toISOString().substring(5, 7);
      for (var i = 0; i < 13; i++) {
        if (month <= 12) {
          discounts[monthNames[month - 1] + " " + year] = 0;
          revenues[monthNames[month - 1] + " " + year] = 0;
          month++;
        } else {
          month = 1;
          year++;
          discounts[monthNames[month - 1] + " " + year] = 0;
          revenues[monthNames[month - 1] + " " + year] = 0;
        }

      }
      _.each(groupedByMonth, function(item, key) {
        var dYearDate = key.split("-");
        var total = 0;
        var Distotal = 0;
        _.each(item, function(itemData, DataKey) {
          total = parseInt(total) + parseInt(itemData.billAmount);
          Distotal = parseInt(Distotal) + parseInt(itemData.finalAmount);
        })
        revenues[monthNames[dYearDate[1] - 1] + " " + dYearDate[0]] = total;
        discounts[monthNames[dYearDate[1] - 1] + " " + dYearDate[0]] = Distotal;
      });
      _.each(revenues, function(item, key) {
        revenues[key] = item;
      });
      _.each(discounts, function(item, key) {
        discounts[key] = item;
      });

      revenues_and_discounts = {
        revenues: revenues,
        discounts: discounts
      };

      _.each(revenues_and_discounts.revenues, function(item, key) {

        revenues_and_discounts.discounts[key] = revenues[key] - revenues_and_discounts.discounts[key];
      });
    }

    orderDetails.uniqueUsers = _.unique(orderData, 'userId').length;
    var uniqueLocation = _.unique(orderData, 'locationOfService.name');
    orderDetails.orderLocations = uniqueLocation.length;
    _.each(orderData, function(item) {
      if (item.billAmount && item.finalAmount) {
        totalAmount = parseInt(totalAmount) + parseInt(item.billAmount);
        afterDTA = parseInt(afterDTA) + parseInt(item.finalAmount);
      }
    }, 0);

    orderDetails.totalAmount = totalAmount;
    // orderDetails.afterDTA = afterDTA;
    orderDetails.discountAmount = parseInt(totalAmount) - parseInt(afterDTA);

    orderDetails.revenues_and_discounts = revenues_and_discounts;
    finalData = {
      orderDetails: orderDetails,
      schemeDetails: schemeData[0]
    };
    return finalData;

  };

  chUtils.uniqueUsersData = function(schemeData, orderData)
  {

    var week = "1Week";
    var revenues = {};
    var finalData = {};
    var totalAmount = 0;
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    if (schemeData[0].metadata.type == "COUPON") {
      var startDate = moment(schemeData[0].behavior.startDate.toISOString("DD/MM/YYYY"), 'YYYY-M-DD HH:mm:ss');
      var endDate = moment(schemeData[0].behavior.endDate.toISOString("DD/MM/YYYY"), 'YYYY-M-DD HH:mm:ss');
      var datediff = endDate.diff(startDate, 'days');
      var month = schemeData[0].behavior.startDate.toISOString().substring(5, 7);
      var groupedByMonth = _.groupBy(orderData, function(item) {
        return item.dateOfService.toISOString().substring(5, 10);
      });
      if (datediff <= 7) {
        for (var i = 1; i <= 7; i++) {
          revenues[i + " Day " + monthNames[month - 1]] = 0;
        }
        _.each(groupedByMonth, function(item, key) {

          var dYearDate = key.split("-");

          var uniqueList = _.uniq(item, function(item, key, userId) {
            return item.userId;
          });
          revenues[parseInt(dYearDate[1]) + " Day " + monthNames[dYearDate[0] - 1]] = uniqueList.length;
        });
      } else {

        for (var i = 1; i <= 5; i++) {
          revenues[i + " Week " + monthNames[month - 1]] = 0;
        }
        _.each(groupedByMonth, function(item, key) {
          var dYearDate = key.split("-");
          if (dYearDate[1] <= 7) {
            week = "1 Week ";
          } else if (dYearDate[1] <= 14) {
            week = "2 Week ";
          } else if (dYearDate[1] <= 21) {
            week = "3 Week ";
          } else if (dYearDate[1] <= 28) {
            week = "4 Week ";
          } else {
            week = "5 Week ";
          }
          var uniqueList = _.uniq(item, function(item, key, userId) {
            return item.userId;
          });
          revenues[week + monthNames[dYearDate[0] - 1]] = uniqueList.length;
        });
      }
    } else {
      var groupedByMonth = _.groupBy(orderData, function(item) {
        return item.dateOfService.toISOString().substring(0, 7);
      });     
      var year = schemeData[0].behavior.startDate.toISOString().substring(0, 4);
      var month = schemeData[0].behavior.startDate.toISOString().substring(5, 7);
      for (var i = 0; i < 13; i++) {
        if (month <= 12) {
          
          revenues[monthNames[month - 1] + " " + year] = 0;
          month++;
        } else {
          month = 1;
          year++;
      
          revenues[monthNames[month - 1] + " " + year] = 0;
        }
      }         
      _.each(groupedByMonth, function(item, key) {

        var dYearDate = key.split("-");
        var uniqueList = _.uniq(item, function(item, key, userId) {
          return item.userId;
        });
        revenues[monthNames[dYearDate[1] - 1] + " " + dYearDate[0]] = uniqueList.length;
      });
    }
    return revenues;
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
        if(ostr===undefined || ostr===null || ostr==""){
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