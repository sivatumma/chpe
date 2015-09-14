var toIsoString = function(str){
        var date = new Date();
            if(str){
                date = new Date(str);
                return date.toISOString();
            }else{
                return date.toISOString();
            }
    };