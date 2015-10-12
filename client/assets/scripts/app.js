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

   window.onload = function(){
    console.log(location);
   };

  app.handleResponse = function(event) {
    console.log(event.detail, event.detail.xhr);
    console.log(event.target.lastResponse);
    console.log(event.target, event.target.error);
  };
  app.handleResponse.readystatechange = function(res){
    console.log(res);
  };
  app.handleError = function(event) {
    console.log(event, event.target);
  };
  app.getTitle = function(event){
    console.log(event.currentTarget.getAttribute('title'));
    app.screenTitle = event.currentTarget.getAttribute('title');
    return app.screenTitle
  };
  app.addonAsScheme =  app.couponAsScheme = app.giftcardAsScheme = schemeBase();

  //to get edit scheme screen and set the relavent data
  var x = {};
      x.metadata = {name:"Siva"};
      x.behavior = {discountType:"FLAT",discount:10};
  app.editScheme  = function(event){ 
    app.couponAsScheme = x;
    event.stopPropagation();
  };


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

  //toggle search bar
  app.toggleSearch  = function(){
    
  };

})(document);
