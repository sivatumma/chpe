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

  app.params = []; var loop=-1;
  //more routuing alternative method
  var template = document.querySelector('template');
  template.makeUrl = function(path, params) {
    var params = params ? JSON.parse(params) : {};
    app.params = app.params?app.params:[];
    if(params.name!==undefined){
     this.push('params',params);
      console.log(this.params,path);
    }
    return MoreRouting.urlFor(path, {name:params.name});
  };

  /*
   *Method for setting base scheme
   *@use this method  
   */
  app.setScheme = function(){
    app.addonMethod   =  app.couponMethod = app.giftcardMethod = "POST"; 
    app.saveBtnText   = "SAVE"; app.publishBtnText   = "SAVE + PUBLISH";
    app.addonAsScheme =  app.couponAsScheme = app.giftcardAsScheme = schemeBase();
  };

  app.setScheme();
  app.currentPage = "";
  
  app.getTitle = function(event){
    this.getCurrentPage(event.currentTarget.getAttribute('route'));
    //app.screenTitle = event.currentTarget.getAttribute('title');
    app.setScheme();
    chUtils.resetForm('coupon-form');
    chUtils.resetForm('addon-form');
    chUtils.resetForm('gift-card-form');

    app.location = function(){return document.location;};

  };

  //display selected tool bars 
  app.showPalet = function(paletName){
    app.isHome = app.isCoupon = app.isAddon =  app.isGiftCard=false; 
   switch(paletName){
      case "/":
        app.isHome = true;
        break;
      case "/createAddOn":
        app.isAddon  = true;
        break;
      case "/createCoupon":
        app.isCoupon = true;
        break;
      case "/createGiftCard":
        app.isGiftCard = true;
        break;
   }
  };

  //to get current path name
  app.getCurrentPage = function(name){
    if(name===undefined){
      this.currentPage = location.hash.split("!")[1];
    }else{
      this.currentPage = MoreRouting.getRouteByName(name).path;
    }
    if(this.currentPage!==undefined){
      this.showPalet(this.currentPage);
    }
  };

  app.getCurrentPage();


  //home page list grid manipulations
  app.toggleListGridIcon = "icons::view-list";
  app.toggleListGrid = function(event) {
    var mode = event.currentTarget.getAttribute('view');
      if (mode == "list") {
          document.querySelector("#listView").hidden = false;
          document.querySelector("#gridView").hidden = true;
          this.toggleListGridIcon = "icons:view-module";
          event.currentTarget.setAttribute('view', 'grid');
      } else {
          this.toggleListGridIcon = "icons:view-list";
          event.currentTarget.setAttribute('view', 'list');
          document.querySelector("#listView").hidden = true;
          document.querySelector("#gridView").hidden = false;
      }
  };

  app.location = function(){return document.location;};

  app.previewSchemeName = "";

})(document);
