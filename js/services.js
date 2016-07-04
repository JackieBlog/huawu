angular.module('app.services', [])
   /* .factory('UserInterceptor', ["$q","$rootScope",function ($q,$rootScope) {
        return {
            request:function(config){
                config.headers["TOKEN"] = localStorage.getItem('token');
                return config;
            },
            responseError: function (response) {
                console.log(response)
                var data = response.data;
                // 判断错误码，如果是未登录
                if(data["errorCode"] == "500999"){
                    // 清空用户本地token存储的信息，如果
                    $rootScope.user = {token:""};
                    // 全局事件，方便其他view获取该事件，并给以相应的提示或处理
                    $rootScope.$emit("userIntercepted","notLogin",response);
                }
                // 如果是登录超时
                if(data["errorCode"] == "500998"){
                    $rootScope.$emit("userIntercepted","sessionOut",response);
                }
                console.log($q.reject(response))
                return $q.reject(response);
            }
        };
    }])*/
   
    .directive('multipleEmail', [function () {
        return {
            require: "ngModel",
            link: function (scope, element, attr, ngModel) {
                if (ngModel) {
                    var emailsRegexp = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/i,
                        phoneRegexp = /(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/g;
                }
                var customValidator = function (value) {
                    var validity = ngModel.$isEmpty(value) || emailsRegexp.test(value) || phoneRegexp.test(value);
                    ngModel.$setValidity("multipleEmail", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);
            }
        };
    }])
    .service('forgetService',['$http',function($http) {
        this.testPost=function(congfig){
            return $http.post(
                url+'registration_send_sms',
                congfig,{cache:true});
        };
        this.testComent=function(congfig){
            return $http.post(
                url+'registration_pin_compare',
                congfig,{cache:true});
        };
        this.emailPost=function(congfig){
            return $http.post(
                url+'registration_send_Email',
                congfig,{cache:true});
        };

    }])
    .service('passwordService',['$http',function($http) {
        this.pwdData=function(congfig){
            return $http.post(
                url+'registration_update_pwd',
                congfig,{cache:true});
        };

    }])
    .service('actuallyService',['$http',function($http) {
        this.blurry=function(congfig){
            return $http.post(
                url+'house_list',
                congfig,{cache:true});
        };
        this.blurryBtn=function(congfig){
            return $http.post(
                url+'house_id_get',
                congfig,{cache:true});
        };
    }])
    .service('actuallyContestService',['$http',function($http) {
        this.blurryData=function(congfig){
            return $http.post(
                url+'competing_house_info',
                congfig,{cache:true});
        };
        this.chartsData=function(congfig){
            return $http.post(
                url+'competing_house_info_proportion',
                congfig,{cache:true});
        };
        this.tableData=function(congfig){
            return $http.post(
                url+'competing_house_info_head',
                congfig,{cache:true});
        };
        this.baseData=function(congfig){
            return $http.post(
                url+'competing_baseinfo',
                congfig,{cache:true});
        };
        this.certData=function(congfig){//预售证
            return $http.post(
                url+'competing_house_cert_no',
                congfig,{cache:true});
        };
        this.certDetailsData=function(congfig){
            return $http.post(
                url+'competing_cert_no_details',
                congfig,{cache:true});
        };
        this.competingData=function(congfig){
            return $http.post(
                url+'competing_recommend_projct',
                congfig,{cache:true});
        };
    }])
    .service('getLandServices',['$http',function($http) {
        this.getDate=function(){
            return $http.get(
                url+'get_date',
                {cache:true});
        };
        this.getType=function(){
            return $http.get(
                url+'blcok_type_list',
                {cache:true});
        };
        this.getArea=function(){
            return $http.get(
                url+'get_district',
                {cache:true});
        };
        this.getPlate=function(config){
            return $http.post(
                url+'get_plate',
                config,{cache:true});
        };
        this.getInfoList=function(config){
            return $http.post(
                url+'block_list_search',
                config,{cache:true});
        };
    }])
    .service('getLandContestServices',['$http',function($http) {
        this.getBlock=function(config){
            return $http.post(
                url+'block_info',
                config,{cache:true});
        };
        this.getPlate=function(config){
            return $http.post(
                url+'block_list_by_sold',
                config,{cache:true});
        };
        this.getWillSell=function(config){
            return $http.post(
                url+'block_list_by_will_sell',
                config,{cache:true});
        };
        this.getInfoPlate=function(config){
            return $http.post(
                url+'block_info_by_plate',
                config,{cache:true});
        };
    }])
    .service('rankingServices',['$http',function($http) {
        this.getRanking=function(congfig){
            return $http.post(
                url+'ranking',
                congfig,{cache:true});
        };
    }])
    .service('designServices',['$http',function($http) {
        this.getRanking=function(congfig){
            return $http.post(
                url+'design_list_search',
                congfig,{cache:true});
        };
    }])
    .service('marketingServices',['$http',function($http) {
        this.getRanking=function(congfig){
            return $http.post(
                url+'marketing_list_search',
                congfig,{cache:true});
        };
    }])
    .service('superSearchServices',['$http',function($http) {
        this.getRanking=function(congfig){
            return $http.post(
                url+'super_searching_result',
                congfig,{cache:true});
        };
    }])
    .service('loginServices',['$http',function($http) {
    		//获得登陆用户信息
        this.getData=function(congfig){
            return $http.post(
                url+'registration_login',
                congfig,{cache:true});
        };
        this.getTonken=function(congfig){
            return $http.post(
                url+'registrion_access_token',
                congfig,{cache:true});
        };
     
    }])
    .service('attentionServices',['$http',function($http) {
        this.getData=function(congfig){
            return $http.post(
                url+'registration_collect_list',
                congfig,{cache:true});
        };
    }])
    .service('addAttentionServices',['$http',function($http) {
        this.getData=function(congfig){
            return $http.post(
                url+'registration_collect_add',
                congfig,{cache:true});
        };
        this.deleteData=function(congfig){
            return $http.post(
                url+'registration_collect_delete',
                congfig,{cache:true});
        };
    }])  .service('excel_Service',['$http',function($http) {
    		//超级搜索下载excel
        this.getExcel_super_search=function(congfig){ 
            return $http.post(
                url+'excel_super_search',
                congfig,{cache:true,responseType: 'arraybuffer'});
        };
        //预售证详情下载excel
         this.getExcel_competing_house_cert_no_details=function(congfig){   
            return $http.post(
                url+'excel_competing_house_cert_no_details',
                congfig,{cache:true,responseType: 'arraybuffer'});
        };
    }]);

