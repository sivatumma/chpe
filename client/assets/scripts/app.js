/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
   
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('.app-name');
    var middleContainer = document.querySelector('.middle-container');
    var bottomContainer = document.querySelector('.bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel && drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.params = [];

  //more routuing alternative method
  var template = document.querySelector('template');
  template.makeUrl = function(path, params) {
    var parameters = parameters ? JSON.parse(params) : {};
    app.params = app.params?app.params:[];
    if(parameters.name!==undefined){
     this.push('params',parameters);
      console.log(this.parameters,path);
    }
    return MoreRouting.urlFor(path, {name:parameters.name});
  };

  /*
   *Method for resetting/setting the  base scheme
   *@use this method  
   */
  app.setScheme = function(){
    app.addonMethod   =  app.couponMethod = app.giftcardMethod = 'POST'; 
    app.saveBtnText   = 'SAVE'; app.publishBtnText   = 'SAVE + PUBLISH';
    app.addonAsScheme = schemeBase();
    app.couponAsScheme = schemeBase();
    app.giftcardAsScheme = schemeBase(); 
    
    app.addonStage = 0; 
    app.couponStage = 0; 
    app.giftCardStage = 0; 
  };


 /**
   * We should run all these methods and on page load to show path related palets on below of main toolbar
   */
  app.setScheme();
  app.addonTitle    =  'Create Addon';
  app.couponTitle   =  'Create Coupon';
  app.giftCardTitle =  'Create Gift Card';


  app.getTitle = function(event){
    this.getCurrentPage(event.currentTarget.getAttribute('route'));
    app.setScheme();
    app.location = function(){return document.location;};
    chUtils.disableInputs(false,'addon-form');
    chUtils.disableInputs(false,'coupon-form');
    chUtils.disableInputs(false,'gift-card-form');
    app.addonTitle    =  'Create Addon';
    app.couponTitle   =  'Create Coupon';
    app.giftCardTitle =  'Create Gift Card';

  };


  /**
    * This method used to show the current plaen name
    * @params palentName
    * Exp Res : if we pass '/' , it will show homepage palet
    */
  app.showPalet = function(paletName){
    app.isHome = app.isCoupon = app.isAddon =  app.isGiftCard = app.isPreviewScheme = false; 
   switch(paletName){
      case '/':
        app.isHome = true;
        break;
      case '/createAddOn':
        app.isAddon  = true;
        break;
      case '/createCoupon':
        app.isCoupon = true;
        break;
      case '/createGiftCard':
        app.isGiftCard = true;
        break;
      case '/previewScheme':
       app.isPreviewScheme = true;
       break;
    }
  };


 //setting current Palet
 app.currentPalet = function(currentPage){
    if(currentPage!==undefined){
        this.showPalet(currentPage);
      }else{
        this.showPalet('/');
      }
 };
 
  //to get current path name
  app.getCurrentPage = function(name){
    if(name===undefined){
      this.currentPage = location.hash.split('!')[1];
      this.currentPalet(this.currentPage); 
    }else{
      this.currentPage = MoreRouting.getRouteByName(name).path;
      this.currentPalet(this.currentPage); 
    }
    
  };

  //to set Page Icons on load we have to run this method
  app.getCurrentPage();


 /**
   *This method is used to switch grid view to list view list view to grid view
   * @params curentTargetAttribute 
   * Exp Res : If list grid will display , If Grid list will display 
   */
  app.toggleListGridIcon = 'icons::view-list';
  app.listGridVar = '';
  app.toggleListGrid = function(event) {
    var mode = event.currentTarget.getAttribute('view') || app.listGridVar;
      if (mode === 'list') {
          document.querySelector('#listView').hidden = false;
          document.querySelector('#gridView').hidden = true;
          app.toggleListGridIcon = 'icons:view-module';
          event.currentTarget.setAttribute('view', 'grid');
      } else {
          app.toggleListGridIcon = 'icons:view-list';
          event.currentTarget.setAttribute('view', 'list');
          document.querySelector('#listView').hidden = true;
          document.querySelector('#gridView').hidden = false;
      }
  };

  app.location = function(){return document.location;};

 /**
  *This method is used to check user logged in or not in client
  *On server hit Head Method any error will comes , user will goto sso login
  */
  app.handleUserError = function(event){
    console.log(event.detail.error);
    window.location = '/';
  };

 /**
  *This method is used to check user logged in or not in client
  *On server hit of  Head Method any error will comes , user will goto sso login
  *On success user information is shown in dropdown toggle button including role and logged in username
  */
  app.handleUserResponse = function(event,request){
    var headers = JSON.parse(request.xhr.getResponseHeader('user')) || '';
      if(chUtils.isEmpty(headers)===false){
        app.userInfo = headers || {};
      }else{
        app.userInfo =  {};
        window.location = '/';
      }
  };



})(document);
