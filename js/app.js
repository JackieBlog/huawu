var app = angular.module('app', ['ui.router','tm.pagination','app.controllers','app.services']),
    url ="http://www.88house.com.cn/test/pc_hwdeal_interface/";
app.config(["$stateProvider", "$urlRouterProvider",'$locationProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider) {

  //$httpProvider.interceptors.push('UserInterceptor');

  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('app', {
    "abstract": !0,
    url: "/app",
    views:{
      "": {
        templateUrl: "views/layout.html"
      }
    }
  }).state('login',{
    url:"/login",
    controller: "login",
       cache:"false", 
    templateUrl: "views/login.html"
  }).state('forget',{
    url:"/forget",
    controller: "forget",
    templateUrl: "views/pages/forget.html"
  }).state('password',{
    url:"/password",
    controller:"password",
    templateUrl: "views/pages/password.html"
  }).state('app.search',{
    url:"/search",
    controller: "search",
    templateUrl: "views/search.html"
  }).state('app.search.actually',{
    url:"/actually",
    controller: "actually",
    templateUrl: "views/search_pages/actually.html"
  }).state('app.search.ranking',{
    url:"/ranking",
    controller: "ranking",
    templateUrl: "views/search_pages/ranking.html"
  }).state('app.search.getLand',{
    url:"/getLand",
    controller: "getLand",
    templateUrl: "views/search_pages/getLand.html"
  }).state('app.search.design',{
    url:"/design",
    controller: "design",
    templateUrl: "views/search_pages/design.html"
  }).state('app.search.marketing',{
    url:"/marketing",
    controller: "marketing",
    templateUrl: "views/search_pages/marketing.html"
  }).state('app.downLoad',{
    url:"/downLoad",
    controller: "downLoad",
    templateUrl: "views/pages/downLoad.html"
  })

}]);
angular.module('app')

.config(["$stateProvider",function($stateProvider) {
      $stateProvider.state('page', {
        url: "/page",
        views: {
          "": {
            templateUrl: "views/content_layout.html"
          }
        }
      }).state('page.actually',{
        url:"/actually/:house_id",
        controller: "actuallyContent",
        templateUrl: "views/pages/actually.html"
      }).state('page.ranking',{
        url:"/ranking/{loop_id}/{area_type_id}/{total_price_type_id}/{district_id}/{plate_id}/{total_price1}/{total_price2}",
        controller: "rankingContent",
        templateUrl: "views/pages/ranking.html"
      }).state('page.getLand',{
        url:"/getLand/:blockId",
        controller: "getLandContent",
        templateUrl: "views/pages/getLand.html"
      }).state('page.design',{
        url:"/design/{volume_rate_id}/{area_type_id}/{total_price_type_id}/{district_id}/{plate_id}/{total_price1}/{total_price2}",
        controller: "designContent",
        templateUrl: "views/pages/design.html"
        }).state('page.marketing',{
        url:"/marketing/{monthly_selling_type_id}/{area_type_id}/{total_price_type_id}/{district_id}/{plate_id}/{total_price1}/{total_price2}",
        controller: "marketingContent",
        templateUrl: "views/pages/marketing.html"
      }).state('page.superSearch',{
        url:"/superSearch",
        controller: "superSearch",
        templateUrl: "views/pages/superSearch.html"
      }).state('page.attention',{
        url:"/attention",
        controller: "attention",
        templateUrl: "views/pages/attention.html"
      }).state('page.about',{
        url:"/about",
        controller: "about",
        templateUrl: "views/pages/about.html"
      }).state('page.data',{
        url:"/data",
        controller: "data",
        templateUrl: "views/pages/data.html"
      });
  //$locationProvider.html5Mode(true);
}]);

Date.prototype.format = function(format){
  var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(), //day
    "h+" : this.getHours(), //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter
    "S" : this.getMilliseconds() //millisecond
  };

  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
};
function cloneObj(obj){
  var o, obj;
  if (obj.constructor == Object){
    o = new obj.constructor();
  }else{
    o = new obj.constructor(obj.valueOf());
  }
  for(var key in obj){
    if ( o[key] != obj[key] ){
      if ( typeof(obj[key]) == 'object' ){
        o[key] = cloneObj(obj[key]);
      }else{
        o[key] = obj[key];
      }
    }
  }
  o.toString = obj.toString;
  o.valueOf = obj.valueOf;
  return o;
}

function realArray(c) {
  try {
    return Array.prototype.slice.call(c);
  } catch (e) {
    var ret = [], i = 0, len = c.length;
    for (; i < len; i++) {
      ret[i] = (c[i]);
    }
    return ret;
  }
}