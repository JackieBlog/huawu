angular.module('app.controllers', [])

    .controller('mainCtrl',['$scope','$rootScope','$http','$state','addAttentionServices','attentionServices',function($scope,$rootScope,$http,$state,addAttentionServices,attentionServices){
     /*   $scope.requestTime = '[waiting]';
        $http.get('https://api.github.com/users/naorye/repos').then(function(response) {
            var time = response.config.responseTimestamp - response.config.requestTimestamp;
            $scope.requestTime = (time / 1000);
        });*/
       /* $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
            if(toState.name=='login')return;// 如果是进入登录界面则允许
            // 如果用户不存在
            if(!localStorage.getItem('user')){
                event.preventDefault();// 取消默认跳转行为
                $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
            }
        });*/
        $rootScope.userData = JSON.parse(localStorage.getItem('userData'));
        $rootScope.var = {//基础变量
            default:'',
            isSSHead:0,
            show: false,
            attr:'getAttribute',
            loginState:0,
            IsAtt:1
        };
        $rootScope.data = {//固定数据
            loop:[{id:1, value:"内环内"},{id:2, value:"内中环间"},{id:3, value:"中外环间"},{id:4, value:"外环以外"}],
            rate:[{id:1, value:"≤0.3"},{id:2, value:"0.4-0.6"},{id:3, value:"0.7-1.0"},{id:4, value:"1.1-1.4"},{id:5, value:"1.5-1.8"},{id:6, value:"1.9-2.5"},{id:7, value:"2.6-3.0"},{id:8, value:"＞3.0"}],
            speed:[{id:1, value:"≤20套"},{id:2, value:"21-40套"},{id:3, value:"41-60套"},{id:4, value:"81-80套"},{id:5, value:"81-100套"},{id:6, value:"＞100套"}],
            areaType:[{id:1,value:"≤65㎡"},{id:2,value:"66-80㎡"},{id:3,value:"81-100㎡"},{id:4,value:"101-125㎡"},{id:5,value:"126-150㎡"},{id:6,value:"151-180㎡"},{id:7,value:"181-220㎡"},{id:8,value:"221-300㎡"},{id:9,"value":"＞300㎡"}],
            price:[{"id":1,"value":"≤300万以下"},{"id":2,"value":"300-500万"},{"id":3,"value":"500-800万"},{"id":4,"value":"800-1500万"},{"id":5,"value":"＞1500万以上"}]
        };
        var flag = 1;
        $rootScope.fnSet = {//工具函数
            toggleMenu: function() {
                $rootScope.var.show = !$rootScope.var.show;
            },
            exitFn: function(con){
                var a = null;
                if(con === 1){
                    localStorage.removeItem('user');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('token');
                    $state.go("login");
                    location.reload()
                }else{
                    a = confirm("是否要退出账号？")
                    if(a){
                        localStorage.removeItem('user');
                        localStorage.removeItem('userData');
                        localStorage.removeItem('token');
                        $state.go("login");
                        location.reload()
                    }else{ return}
                }
            },
            attention:function(e){
                var target = e.target,
                    id = target[$rootScope.var.attr]('data-id'),
                    type = target[$rootScope.var.attr]('data-type'),
                    tab = function(text,cls){
                        target.innerHTML = text;
                        target.classList.add(cls) ;
                    };
                if(flag){
                    flag = 0;
                    if(target.classList.contains('attention')){
                        console.log(1)
                        addAttentionServices.getData({
                            registration_id: JSON.parse(localStorage.getItem('userData')).registration_id,
                            collect_id: id,
                            collect_type:type
                        }).success(function(data){
                            flag = 1;
                            console.log(data);
                            //if(data.result == 0) return;
                            tab('已关注','atten');
                            attentionServices.getData({
                                registration_id : JSON.parse(localStorage.getItem('userData')).registration_id
                            }).success(function(data){
                                localStorage.setItem('attentionData',JSON.stringify(data.data));
                            });
                            //data.result == 0 ?   tab('已关注','atten') : tab('关注','atten');
                        });

                    }
                }

            },
            attentionState:function(test){
                var a = realArray(document.querySelectorAll('.attention')),
                    obj = JSON.parse(localStorage.getItem('attentionData')),
                    fn = function(){
                        for(var i in a){
                            if(a[i][$rootScope.var.attr]('data-id') == obj[o].collect_id){
                                a[i].classList.add('atten');
                                a[i].innerHTML = '已关注';
                            }
                        }
                    };
                if(test === 1){
                    for(var o in obj){
                        obj[o].collect_type == 1 && fn();
                    }
                }else
                if(test === 2){
                    for(var o in obj){
                        obj[o].collect_type == 2 && fn();
                    }
                }
            },
            tab : function(target){//样式切换
                var i = 0,
                    len = target.parentNode.children;
                for(;i<len.length;i+=1){
                    len[i].classList.remove('active');
                }
                target.classList.add('active');
            },
            scrollFn:function(e){//位置切换
                var target = e.target,
                    getId = 'getElementById',
                    idVal =target[$rootScope.var.attr]('data-id'),
                    offsetTop = document[getId](idVal).offsetTop;
                this.tab(target);
                window.scrollTo(0,offsetTop);
            },
            oder : function(e,fn,params){//排序功能
                var target = e.target,
                    key;
                while(target.nodeName !== "I"){
                    target = target.parentNode;
                }
                if(target.nodeName =='I'){
                    target.classList.toggle('oderUp1');
                    key = target[$rootScope.var.attr]('data-key');
                    if(target.classList.contains('oderDown0')){
                        target.classList.add('oderUp1');
                        target.classList.remove('oderDown0');
                        params.order_by_id = key;
                        params.is_asc = 1;
                        fn(params);
                    }else if(target.classList.contains('oderUp1')){
                        target.classList.add('oderDown0');
                        target.classList.remove('oderUp1');
                        params.order_by_id = key;
                        params.is_asc = 0;
                        fn(params);
                    }else{
                        params.order_by_id = "";
                        params.is_asc = "";
                        fn(params);
                    }
                }
            },
            area: function(getLandServices){//区域选择功能
                $scope.plate = true;
                $scope.areaObj = {};
                $scope.config = {};
                $scope.ranking = {};
                $scope.yearShow = {
                    show_one: false,
                    show_two: false
                };

                $scope.areaFn = function(e){
                    console.log(getLandServices)
                    var district_id,ul,li,plateUl,
                        cdf = document.createDocumentFragment();


                    if(e.target.nodeName == "A"){
                        $rootScope.fnSet.tab(e.target);
                        $rootScope.var.default = "";
                        $scope.ranking.isArea = true;
                        $scope.ranking.isLoop = false;
                        $rootScope.isActive = false;
                        $rootScope.isDisabled= 1;
                        $scope.plate = false;
                        $scope.yearShow.show_one = true;
                        $scope.areaObj.plate = '';
                        district_id = e.target[$rootScope.var.attr]('data-district');
                        $scope.config.district_id = district_id;
                        $scope.areaObj.district = e.target.innerHTML;
                        $scope.areaObj.districtId = e.target[$rootScope.var.attr]('data-district');
                        getLandServices.getInfoList($scope.config).success(function(data){
                            $scope.infoList = data.data;
                        });
                        getLandServices.getPlate({
                            district_id: district_id
                        }).success(function(data){
                            ul = document.querySelectorAll('.layer_area a');
                            plateUl = document.querySelector('.plate');
                            angular.forEach(data.data,function(data){
                                li = '<li data-plate='+data.plate_id+'>'+data.plate_name+'</li>';
                                angular.element(cdf).append(li);
                            });

                            angular.element(plateUl).empty().append(angular.element(cdf));
                        });
                    }
                    if(e.target.nodeName =='LI'){
                        $rootScope.fnSet.tab(e.target);
                        $scope.areaObj.plate = e.target.innerHTML;
                        $scope.areaObj.plateId = e.target[$rootScope.var.attr]('data-plate');
                        $scope.config.plate_id = $scope.areaObj.plateId;
                    }
                };
            },
            areaType:function(){//面积段选择功能
                $scope.areaTypeFn = function(e){
                    var target = e.target;
                    $rootScope.isActive = false;
                    $rootScope.isDisabled= 1;
                    $scope.ranking.isAreaType = true;
                    $scope.ranking.isSpeed && ($scope.ranking.isSpeed = false);
                    $scope.ranking.isPrice = false;
                    $scope.yearShow.show_two = true;
                    $rootScope.var.default = "";
                    $scope.ranking.areaType = target.innerHTML;
                    $scope.ranking.areaTypeId = target[$rootScope.var.attr]('data-typeId');
                };
            },
            price:function(){//总价段选择功能
                $scope.priceFn = function(e){
                    var target = e.target;
                    $rootScope.isActive = false;
                    $rootScope.isDisabled= 1;
                    $scope.ranking.isAreaType = false;
                    $scope.ranking.isSpeed && ($scope.ranking.isSpeed = false);
                    $scope.ranking.isPrice = true;
                    $scope.yearShow.show_two = true;
                    $rootScope.var.default = "";
                    if(target.classList.contains('priceLi') || target.parentNode.classList.contains('priceLi')){
                        target.nodeName == 'A' && ($scope.ranking.price = $scope.ranking.priceBegin+" - "+$scope.ranking.priceEnd+"万");
                        $scope.ranking.priceId = 6;
                    }else{
                        target.nodeName == 'LI' && ($scope.ranking.price = target.innerHTML);
                        $scope.ranking.priceId = target[$rootScope.var.attr]('data-typeId');
                    }
                };
            },
            closeI: function(){//已选择标签删除功能
                $scope.selectCond= function(e){
                    var target = e.target;
                    if(e.target.nodeName === "I"){
                        $scope.yearShow[target.parentNode[$rootScope.var.attr]('ng-show').slice(9)] = false;
                        if($scope.yearShow.show_one == false && $scope.yearShow.show_two == false){
                            $rootScope.isActive = true;
                            $rootScope.isDisabled = 0;
                        }
                    }
                };
            },
            searchBtn:function($state,url){//搜索按钮跳转
                $rootScope.searchFn = function(){
                    var condition = document.querySelectorAll('.condition span'),
                        i = 0,
                        len = condition.length,
                        key,val;
                    $scope.rankingConfig = {};
                    localStorage.removeItem('if1');
                    localStorage.removeItem('if2');
                    for(;i<len;i+=1){
                        key = condition[i][$rootScope.var.attr]('data-key');
                        val = condition[i][$rootScope.var.attr]('data-val');
                        $scope.rankingConfig[key] = val;
                        key == "district_id" && localStorage.setItem('if1', $scope.areaObj.district+" "+ $scope.areaObj.plate);
                        key == "loop_id" && localStorage.setItem('if1', $scope.ranking.loop);
                        key == "rate_id" && localStorage.setItem('if2', $scope.ranking.rate);
                        key == "volume_rate_id" && localStorage.setItem('if2', $scope.ranking.rate);
                        key == "monthly_selling_type_id" && localStorage.setItem('if2', $scope.ranking.rate);
                        key == "area_type_id" && localStorage.setItem('if2', $scope.ranking.areaType);
                        if(key == "total_price_type_id"){
                            localStorage.setItem('if2', $scope.ranking.price);
                            if(val == "6"){
                                $scope.rankingConfig.total_price1 = $scope.ranking.priceBegin;
                                $scope.rankingConfig.total_price2 = $scope.ranking.priceEnd;
                                localStorage.setItem('if2', $scope.ranking.priceBegin +' - '+ $scope.ranking.priceEnd+"万")
                            }
                        }


                    }
                    $state.go("page."+url,$scope.rankingConfig);
                }
            }



    };

       
        $rootScope.fnModule = function($stateParams,rankingServices,count,dataType,sscount){//内容页功能模块
            $scope.dateLayer = false;
            var params = cloneObj($stateParams),
                i;  
            delete params.key; 
            for(i in params){
                if(params[i] == ''){
                    params[i] = 0
                }
            }
            $scope.DLParams = params; 
            $scope.DLParams.DLTime1 = 0;
            $scope.DLParams.DLTime2 = 0;
            $scope.DLParams.DLOder = 0;

            $scope.title ={
                if1:localStorage.getItem('if1'),
                if2:localStorage.getItem('if2'),
                isIf1:false,
                isIf2:false
            };

            $scope.title.if1 && ($scope.title.isIf1 = true);
            $scope.title.if2 && ($scope.title.isIf2 = true);
            $stateParams.to_date = 1;
            $scope.date = {};
            function dataFn($stateParams){
                rankingServices.getRanking($stateParams).success(function(data){
                		console.log($stateParams);
                		console.log(data);
                	
                    $scope.paginationConf.totalItems = data.page_count;
                    sscount && ($scope[sscount] = data.page_count);
                    $scope[dataType] = data.data; 
                    setTimeout(function(){$rootScope.fnSet.attentionState(1)},0);

                });
            }

            $scope.selectFn = function(e){
                var target = e.target,
                    val = target[$rootScope.var.attr]('data-val');
                $rootScope.fnSet.tab(target);
                $stateParams.to_date = val;
                if(val == 4){
                    $scope.dateLayer = true;
                }else{
                    $scope.dateLayer = false;
                    $scope.paginationConf.currentPage = 1;
                    dataFn($stateParams);
                }
            };
            $scope.dateFn = function(){
                $stateParams.time1 = $scope.date.begin;
                $stateParams.time2 = $scope.date.ends;
                $scope.DLParams.DLTime1 = $stateParams.time1.getTime();
                $scope.DLParams.DLTime2 = $stateParams.time2.getTime();
                if($stateParams.time1  && $stateParams.time2){
                    dataFn($stateParams);
                    $scope.dateLayer = false;
                    $scope.paginationConf.currentPage = 1;
                }else{ return}
            };
            $scope.oderFn = function(e){
                $scope.DLParams.DLOder = e.target[$rootScope.var.attr]('data-key');
                $rootScope.fnSet.oder(e,dataFn,$stateParams)
            };


            var GetAllEmployee = function () {
                $stateParams.page = $scope.paginationConf.currentPage;
                window.scrollTo(0,0);
                dataFn($stateParams)
            };

            $scope.paginationConf = {
                currentPage: 1,
                itemsPerPage: count
            };

            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetAllEmployee);
        };

    }]).controller('login',['$scope','$rootScope','$state','loginServices','attentionServices',function($scope,$rootScope,$state,loginServices,attentionServices){

        $scope.mes = '请输入正确的账号';

        $scope.mesHide = true;
        $scope.mesHides = true;
        $scope.mesFn = function($event){
            $event.target.value  && ($scope.mes ='请输入正确的账号');
            $scope.mesHide= false;
            $scope.mesHides = true;
        };
        $scope.user = {};
        // 如果用户已经登录了，则立即跳转到一个默认主页上去，无需再登录
        if(localStorage.getItem('token')){
            $state.go('app.search.actually');
            return;
        }

        $scope.processForm = function(){
            var userDate = {
                login_user: $scope.user.name,
                password: $scope.user.password
            };
            loginServices.getData(userDate).success(function(data){
                //console.log(data)
                //console.log(userDate)
                if(data.result === 0){
                    $scope.mes ='账号或者密码错误';
                    $scope.mesHides = false;
                    return

                }else if(data.result === 1){
                    localStorage.setItem('user',JSON.stringify(userDate));
                    localStorage.setItem('userData',JSON.stringify(data.data));
                    $rootScope.userData = JSON.parse(localStorage.getItem('userData'));
                    loginServices.getTonken({
                        registration_id: $rootScope.userData.registration_id,
                        token: $rootScope.userData.registration_id+'8e9b109eedc27959233242342342'
                    }).success(function(data){
                        data.result == 1 && localStorage.setItem('token','1');
                    });
                    attentionServices.getData({
                        registration_id : JSON.parse(localStorage.getItem('userData')).registration_id
                    }).success(function(data){
                        localStorage.setItem('attentionData',JSON.stringify(data.data));
                    });
                    $rootScope.var.loginState = 0;
                    $rootScope.var.IsAtt = 1;
                    $state.go("app.search.actually",{username:$rootScope.userData});
                }
            });
        };

        //$state.go("app.search.actually",{w:'notLogin'});

        /*$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

            if(toState.name=='login')return;// 如果是进入登录界面则允许
            // 如果用户不存在
            if(!$rootScope.user || !$rootScope.user.token){
                event.preventDefault();// 取消默认跳转行为
                $state.go("login",{from:fromState.name,w:'notLogin'});//跳转到登录界面
            }
        });
*/


    }]).controller('forget',['$scope','forgetService','$interval','$state',function($scope,forgetService,$interval,$state){
        $scope.n=10;
        $scope.user = {};
        $scope.mes = true;
        $scope.ver = true;
        $scope.text = '发送验证码';
        $scope.mesOne = '你输入的手机号有误';
        $scope.isDisabled = false;
        $scope.isActive = false;
        $scope.email_mes = 1;
        var emailsRegexp = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/i,
            phoneRegexp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            validity = null,
            emailValidity = null;
        $scope.forgetPhone = function(e){
            validity = phoneRegexp.test($scope.user.phone);
            $scope.mes = validity;
            $scope.mesOne = '你输入的手机号有误';
            !$scope.user.phone && ($scope.mes = true);

        };
        $scope.emailFn = function(){
            emailValidity = emailsRegexp.test($scope.email_text);
            $scope.email_mes = emailValidity;
            $scope.email_text =='' && ($scope.email_mes = 1);
        };
        $scope.emailSend = function(){
            console.log($scope.email_text)
            forgetService.emailPost({
                email: $scope.email_text
            }).success(function(data){
                data.result == 0 && ($scope.email_mes = 0 );
                data.result == 1 && alert('发送成功,请查收邮件');
                console.log(data)

            });
        };

        $scope.sendFn = function(){
            var time = null;

            if($scope.user.phone && $scope.mes){
                $scope.isActive = true;
                $scope.isDisabled = true;
                $scope.text = '已发送 ( '+$scope.n+'s )';
                forgetService.testPost(
                    {
                        mobile: $scope.user.phone
                    }
                ).success(function(data){
                    $scope.registratoin_id = data.data.registratoin_id;
                    console.log(data)

                });
                time = $interval(function(){
                    $scope.n--;
                    $scope.text = '已发送 ( '+$scope.n+'s )';
                    if($scope.n==0){
                        $scope.n=10;
                        $scope.isActive = false;
                        $interval.cancel(time);
                        $scope.text='重新发送验证码';
                        $scope.isDisabled=false;
                    }
                },1000);
            }


        };
        $scope.sendText = function(){
            if(!$scope.registratoin_id) return;
            if(!$scope.user.phone){
                $scope.mes = false;
                $scope.mesOne = '请输入的手机号';
            }
            forgetService.testComent(
                {
                    registration_id: $scope.registratoin_id,
                    pin: $scope.user.text
                }
            ).success(function(data){
                console.log(data)
                data.result === 0 && ($scope.ver = false);
                data.result === 1 && $state.go("password");
            });

        }




    }]).controller('password',['$scope','$rootScope','passwordService','$state',function($scope,$rootScope,passwordService,$state){

        $scope.orgin_pw = 0;
        $scope.mes_one = 1;
        $scope.mes_two = 1;
        $scope.sref ='forget';
        if(localStorage.getItem('userData')){
            $scope.orgin_pw = 1;
            $scope.orgin = 1;
            $scope.sref ='app.search.actually';
            $scope.registration_id = JSON.parse(localStorage.getItem('userData')).registration_id;
        }else{
            var url = location.hash,
                str = location.hash.indexOf('=');
            $scope.orgin = 0;
            $scope.registration_id = url.substring(str+1);
        }

        $scope.againFn = function(){
            $scope.user.pw !== $scope.user.pwAg ? ($scope.mes_two = 0) : ($scope.mes_two = 1);
        };
        $scope.determine = function(){

            if($scope.orgin){
                if(!$scope.user.orginPW) return;
            }

            if($scope.mes_two = 0) return;
            $scope.mes_two = 1
            console.log($scope.mes_two)
            passwordService.pwdData(
                {
                    registration_id: $scope.registration_id,
                    ori_password: $scope.user.orginPW,
                    password: $scope.user.pw
                }
            ).success(function(data){
                console.log(data)
                if(data.result === 1){

                    alert('修改成功');
                    $rootScope.fnSet.exitFn(1);
                }

            });
        };

    }]).controller('search',['$scope','$rootScope','$state',function($scope,$rootScope,$state){
        $rootScope.isInx = true;


    }])
    .controller('head_search',['$scope','$rootScope','actuallyService','$state',function($scope,$rootScope,actuallyService,$state){
        $rootScope.var.default = '请输入项目名称';
        $scope.act = {
            show : 0
        };
        $scope.actuallyFn = function(e){
            if($scope.actually == ""){
                $scope.act.show = 0;
            }else{
                //console.log($scope.actually)
                $scope.act.show = 1;
                actuallyService.blurry({
                    search_key:$scope.actually
                }).success(function(data){
                    //console.log(data)
                    $scope.actually_data = data.data;
                });
            }
        };
        $scope.actHref = function(e){
            var target = e.target,
                key = target[$rootScope.var.attr]('data-houseId');
            if(target.nodeName == 'LI'){
                $state.go("page.actually",{house_id:key});
                $scope.act.show = 0;
            }
        };
        $scope.actBtn = function(e){
            if(!$scope.actually) return;
            console.log($scope.actually)
            actuallyService.blurryBtn({
                search_key:$scope.actually
            }).success(function(data){
                data.data != 0 ? $state.go("page.actually",{house_id:data.data}) : $state.go("page.404");
            })

        }

    }])

    //搜索页controller------------------------------------------------------------------------------------------------//
    .controller('actually',['$scope','$rootScope','actuallyService','$state',function($scope,$rootScope,actuallyService,$state){
        $rootScope.isInx = true;
        $rootScope.isInfo = false;
        $rootScope.name='竟品';
        $rootScope.isDisabled= 0;
        $rootScope.isActive = false;
        $rootScope.isInputDisabled = false;
        $rootScope.var.default = '请输入项目名称';
        $rootScope.search_type = "search_type_1";

        $scope.act = {
            show : 0
        };
        $scope.actuallyFn = function(e){
            if($scope.actually == ""){
                $scope.act.show = 0;
            }else{
                //console.log($scope.actually)
                $scope.act.show = 1;
                actuallyService.blurry({
                    search_key:$scope.actually
                }).success(function(data){
                    //console.log(data)
                    $scope.actually_data = data.data;
                });
            }
        };
        $scope.actHref = function(e){
            var target = e.target,
                key = target[$rootScope.var.attr]('data-houseId');
            if(target.nodeName == 'LI'){
                $state.go("page.actually",{house_id:key});
                $scope.act.show = 0;
            }
        };
        $scope.actBtn = function(e){
            if(!$scope.actually) return;
            console.log($scope.actually)
            actuallyService.blurryBtn({
                search_key:$scope.actually
            }).success(function(data){
                data.data != 0 ? $state.go("page.actually",{house_id:data.data}) : $state.go("page.404");
            })

        }






    }]).controller('ranking',['$scope','$rootScope','getLandServices','rankingServices','$state',function($scope,$rootScope,getLandServices,rankingServices,$state){
        $rootScope.isInx = true;
        $rootScope.isInfo = false;
        $rootScope.name='排行';
        $rootScope.isDisabled= 0;
        $rootScope.isActive = true;
        $rootScope.isInputDisabled = true;
        $rootScope.var.default = '请选择分类标签';
        $rootScope.search_type = "search_type_2";

        $rootScope.fnSet.area(getLandServices);
        $rootScope.fnSet.areaType();
        $rootScope.fnSet.price();
        $rootScope.fnSet.closeI();
        $scope.loopFn = function(e){
            var target = e.target;
            $rootScope.isActive = false;
            $rootScope.isDisabled= 1;
            $scope.ranking.isArea = false;
            $scope.ranking.isLoop = true;
            $scope.yearShow.show_one = true;
            $rootScope.var.default = "";
            $scope.ranking.loop = target.innerHTML;
            $scope.ranking.loopId = target[$rootScope.var.attr]('data-typeId');
        };

        getLandServices.getArea().success(function(data){
            $scope.area = data.data;
        });

        $rootScope.fnSet.searchBtn($state,'ranking');

    }]).controller('getLand',['$scope','$rootScope','getLandServices','$state',function($scope,$rootScope,getLandServices,$state){
        $rootScope.isInfo = false;
        $rootScope.name='拿地';
        $rootScope.isDisabled= 0;
        $rootScope.isActive = true;
        $rootScope.isInputDisabled = true;
        $rootScope.var.default = '请选择分类标签';
        $rootScope.search_type = "search_type_3";

        $scope.year = '2015';
        $scope.month = '';
        $scope.plate = true;
        $scope.areaObj = {};
        $scope.config = {};
        $scope.yearShow = {
            show_one: false,
            show_two: false,
            show_s: false
        };
        $scope.change = function(){
            $scope.yearShow.show_s = true;
            $scope.config.year = $scope.year;
            $scope.config.month = $scope.month;
            $rootScope.var.default = "";
            getLandServices.getInfoList($scope.config).success(function(data){
                $scope.infoList = data.data;
            });

        };
        $scope.typeFn = function(e){
            if(e.target.nodeName == 'LI'){
                $scope.yearShow.show_one = true;
                $scope.types = e.target.innerHTML;
                $scope.config.type_id = e.target[$rootScope.var.attr]('data-typeId');
                $rootScope.var.default = "";
                getLandServices.getInfoList($scope.config).success(function(data){
                    $scope.infoList = data.data;
                });
            }
        };
        $scope.areaFn = function(e){
            var district_id,ul,li,plateUl,
                cdf = document.createDocumentFragment();

            if(e.target.nodeName == "A"){
                $rootScope.fnSet.tab(e.target);
                $scope.plate = false;
                $scope.yearShow.show_two = true;
                $rootScope.var.default = "";
                $scope.areaObj.plate = '';
                district_id = e.target[$rootScope.var.attr]('data-district');
                $scope.config.district_id = district_id;
                $scope.areaObj.district = e.target.innerHTML;
                $scope.areaObj.districtId = e.target[$rootScope.var.attr]('data-district');
                getLandServices.getInfoList($scope.config).success(function(data){
                    $scope.infoList = data.data;
                });
                getLandServices.getPlate({
                    district_id: district_id
                }).success(function(data){
                    ul = document.querySelectorAll('.layer_area a');
                    plateUl = document.querySelector('.plate');
                    angular.forEach(data.data,function(data){
                        li = '<li data-plate='+data.plate_id+'>'+data.plate_name+'</li>';
                        angular.element(cdf).append(li);
                    });

                    angular.element(plateUl).empty().append(angular.element(cdf));
                });
            }
            if(e.target.nodeName =='LI'){
                $rootScope.fnSet.tab(e.target);
                $scope.areaObj.plate = e.target.innerHTML;
                $scope.areaObj.plateId = e.target[$rootScope.var.attr]('data-plate');
                $scope.config.plate_id = $scope.areaObj.plateId;
                //console.log($scope.areaObj.plate,$scope.areaObj.plateId)
                getLandServices.getInfoList($scope.config).success(function(data){
                    $scope.infoList = data.data;
                });
            }

        };
        $scope.selectCond= function(e){
            var target = e.target;
            if(e.target.nodeName === "I"){
                $scope.yearShow[target.parentNode[$rootScope.var.attr]('ng-show').slice(9)] = false;
                switch(target.parentNode[$rootScope.var.attr]('ng-show').slice(9)){
                    case "show_one":
                        $scope.config.type_id = '';
                        getLandServices.getInfoList($scope.config).success(function(data){
                            $scope.infoList = data.data;
                        });
                        break;
                    case "show_two":
                        $scope.config.district_id = '';
                        $scope.config.plate_id = '';
                        getLandServices.getInfoList($scope.config).success(function(data){
                            $scope.infoList = data.data;
                        });
                        break;
                    case "show_s":
                        $scope.config.year = '';
                        $scope.config.month = '';
                        getLandServices.getInfoList($scope.config).success(function(data){
                            $scope.infoList = data.data;
                        });
                        break;

                }
            }
        };
        $scope.getLandFn = function(e){
            var target = e.target,
                blockId;
            while(target.nodeName !== "LI"){
                target = target.parentNode;
            }
            if(target.nodeName == "LI"){
                blockId = target[$rootScope.var.attr]('data-blockId');
                $state.go("page.getLand",{blockId:blockId});
            }

        };

        getLandServices.getDate().success(function(data){
            $scope.data = data.data
        });
        getLandServices.getType().success(function(data){
            $scope.type = data.data;
        });
        getLandServices.getArea().success(function(data){
            $scope.area = data.data;
        });
        getLandServices.getInfoList($scope.config).success(function(data){
            $scope.infoList = data.data;
        });
        //getLandServices.getPlate().success(function(data){console.log(data);})


    }]).controller('design',['$scope','$rootScope','getLandServices','$state',function($scope,$rootScope,getLandServices,$state){
        $rootScope.isInx = true;
        $rootScope.isInfo = false;
        $rootScope.name='设计';
        $rootScope.isDisabled= 0;
        $rootScope.isActive = true;
        $rootScope.isInputDisabled = true;
        $rootScope.var.default = '请选择分类标签';
        $rootScope.search_type = "search_type_4";

        $rootScope.fnSet.area(getLandServices);
        $rootScope.fnSet.areaType();
        $rootScope.fnSet.closeI();
        $scope.rateFn = function(e){
            var target = e.target;
            $rootScope.isActive = false;
            $rootScope.isDisabled= 1;
            $scope.ranking.isAreaType = false;
            $scope.ranking.isPrice = true;
            $scope.yearShow.show_two = true;
            $rootScope.var.default = "";
            $scope.ranking.rate = target.innerHTML;
            $scope.ranking.rateId = target[$rootScope.var.attr]('data-typeId');
        };

        getLandServices.getArea().success(function(data){
            $scope.area = data.data;
        });

        $rootScope.fnSet.searchBtn($state,'design');


    }]).controller('marketing',['$scope','$rootScope','getLandServices','$state',function($scope,$rootScope,getLandServices,$state){
        $rootScope.isInx = true;
        $rootScope.isInfo = false;
        $rootScope.name='营销';
        $rootScope.isDisabled= 0;
        $rootScope.isActive = true;
        $rootScope.isInputDisabled = true;
        $rootScope.var.default = '请选择分类标签';
        $rootScope.search_type = "search_type_5";

        $rootScope.fnSet.area(getLandServices);
        $rootScope.fnSet.areaType();
        $rootScope.fnSet.price();
        $rootScope.fnSet.closeI();
        $scope.rateFn = function(e){
            var target = e.target;
            $rootScope.isActive = false;
            $rootScope.isDisabled= 1;
            $scope.ranking.isAreaType = false;
            $scope.ranking.isPrice= false;
            $scope.ranking.isSpeed = true;
            $scope.yearShow.show_two = true;
            $rootScope.var.default = "";
            $scope.ranking.rate = target.innerHTML;
            $scope.ranking.rateId = target[$rootScope.var.attr]('data-typeId');
        };

        getLandServices.getArea().success(function(data){
            $scope.area = data.data;
        });

        $rootScope.fnSet.searchBtn($state,'marketing');

    }])


    //内容页controller------------------------------------------------------------------------------------------------//
    .controller('actuallyContent',['$scope','$rootScope','actuallyContestService','excel_Service','$stateParams','$state',function($scope,$rootScope,actuallyContestService,excel_Service,$stateParams,$state){
        $rootScope.isInfo = true;
        $rootScope.isLogin = false;
        $rootScope.isInx = false;
        $rootScope.var.isSSHead = 0; 
        $scope.houseId = $stateParams.house_id;
        
       
        
        var query = 'querySelector',
            tabList = null,
            typeId = 0,
            lineChart = document[query]('.line_chart'),
            columnChart = document[query]('.column_chart'),
            cake_chart_type = document[query]('.cake_chart_type'),
            cake_chart_floor = document[query]('.cake_chart_floor'),
            cake_chart_price = document[query]('.cake_chart_price'),
            chartFn = function(data){
                var datas = data.data,
                    i = 0, len =datas.length,
                    timeArr = [], price = [],nums=[];
                for(;i<len;i+=1){
                    timeArr.push(datas[i].date);
                    price.push(datas[i].avg_price);
                    nums.push(datas[i].nums);
                }
                echarts.init(lineChart).setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : false,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : timeArr,
                            itemStyle: {
                                normal: {
                                    color: '#44b1d7'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [
                        {
                            name:'平均价',
                            type:'line',
                            data:price,
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            },
                            itemStyle: {
                                normal: {
                                    color: '#44b1d7'
                                }
                            }
                        }

                    ]
                });
                echarts.init(columnChart).setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : timeArr,
                            itemStyle: {
                                normal: {
                                    color: '#44b1d7'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'出售套',
                            type:'bar',
                            data:nums,
                            itemStyle: {
                                normal: {
                                    color: '#44b1d7'
                                }
                            }
                        }
                    ]
                });

                //$scope.actuallyData = data.data;
            },
            cakeChartFn = function(data){
              
                $scope.isCharts = {
                    chart1:0,
                    chart2:0,
                    chart3:0
                };
                var datas = data.data,
                    i, bl = [],
                    colorArr = ['#44b1d7','#59c2e6','#96e4ff','#e4e4e4'];
                for(i in datas){
                    bl[i] = [];
                    for(var k in datas[i]){
                        bl[i][k] = {value:datas[i][k].bl,name:datas[i][k].bl};
                        bl[i][k].price = datas[i][k].hot_price_name;
                        bl[i][k].floor = datas[i][k].floor_name;
                        bl[i][k].area = datas[i][k].area_name;
                    }
                }
                $scope.cakaData ={};
                $scope.cakaData.area = bl['hot_area_view'];
                $scope.cakaData.floor = bl['hot_floor_view'];
                $scope.cakaData.price = bl['hot_price_view'];
                if(bl['hot_area_view'] && bl['hot_area_view'].length != 0){
                    $scope.isCharts.chart1 = 1;
                    echarts.init(cake_chart_type).setOption({
                        calculable : false,
                        color: colorArr,
                        series : [
                            {
                                type:'pie',
                                selectedMode: 'single',
                                radius : [0, 70],
                                x: '20%',
                                width: '40%',
                                funnelAlign: 'right',
                                max: "100%",
                                itemStyle : {
                                    normal : {
                                        label : {
                                            position : 'inner'
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }
                                },
                                data:bl['hot_area_view']
                            }

                        ]
                    });
                }
                if(bl['hot_floor_view'] && bl['hot_floor_view'].length != 0){
                    $scope.isCharts.chart2 = 1;
                    echarts.init(cake_chart_floor).setOption({
                        calculable : false,
                        color: colorArr,
                        series : [
                            {
                                type:'pie',
                                selectedMode: 'single',
                                radius : [0, 70],
                                x: '20%',
                                width: '40%',
                                funnelAlign: 'right',
                                max: "100%",
                                itemStyle : {
                                    normal : {
                                        label : {
                                            position : 'inner'
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }
                                },
                                data:bl['hot_floor_view']
                            }

                        ]
                    });
                }
                if(bl['hot_price_view'] && bl['hot_price_view'].length != 0) {
                    $scope.isCharts.chart3 = 1;
                    echarts.init(cake_chart_price).setOption({
                        calculable: false,
                        color: colorArr,
                        series: [
                            {
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, 70],
                                x: '20%',
                                width: '40%',
                                funnelAlign: 'right',
                                max: "100%",
                                itemStyle: {
                                    normal: {
                                        label: {
                                            position: 'inner'
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    }
                                },
                                data: bl['hot_price_view']
                            }

                        ]
                    });
                }
            },
            tableDataFn = function(config){
                actuallyContestService.tableData(config).success(function(data){
                    //console.log(data.data)
                    $scope.tableData = data.data;
                });
            },
            cakeCharPost = function(){
                var params = cloneObj($scope.params);
                params.compare_type =  1;
                params.to_date =  3;
                console.log(params)
                actuallyContestService.chartsData(params).success(function(data){cakeChartFn(data)});
            };

        $scope.params = {
            house_id: $stateParams.house_id,
            house_type_id: 0,
            group_type: 1,
            compare_type:0,
            to_date: 0
        };
        $scope.cakeParams = {
            house_id: $stateParams.house_id,
            house_type_id: 0,
            group_type: 1,
            compare_type:0,
            to_date: 0
        };
        $scope.tableParams = {
            house_id: $stateParams.house_id,
            to_date: 5,
            house_type_id: 0
        };
        $scope.someParams ={
            house_id: $stateParams.house_id,
            type_id:1
        };
        $scope.date ={};
        $scope.certShow = 0;
        actuallyContestService.blurryData({
            house_id: $stateParams.house_id
        }).success(function(data){
            //console.log(data)
            $scope.actuallyData = data.data;
            setTimeout(function(){$rootScope.fnSet.attentionState(1)},0);
            setTimeout(function(){
                tabList = document[query]('.actType').getElementsByTagName('li')[0];
                tabList.classList.add('active');
                typeId = tabList[$rootScope.var.attr]('data-typeId');
                $scope.params.house_type_id = typeId;

  		//预售证详情明细下载
        $scope.postExcel_competing_house_cert_no_details = function(){
        	   $scope.is_click=1
        	   var params ={}
        	   params.house_id=$scope.houseId;
        	   params.cert_No=$scope.cert_No;  
        	   if($scope.is_click==1){
        	   		 $scope.is_click=0;
        	   	   excel_Service.getExcel_competing_house_cert_no_details (params ).success(function(data){ 
       		    var type;
                type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                var headers= $scope.cert_No+'明细下载';
                saveAs(new Blob([data], { type: type }), decodeURI(headers));  // 中文乱码
                $scope.is_click=1;
            });
        	   }
        
        };

                $scope.typeFn = function(e){
                    var target = e.target,
                        val = target[$rootScope.var.attr]('data-typeId');
                    $rootScope.fnSet.tab(target);
                    $scope.params.house_type_id = val;
                    $scope.tableParams.house_type_id = val;
                    actuallyContestService.chartsData($scope.params).success(function(data){chartFn(data)});
                    console.log($scope.tableParams.house_type_id)
                    tableDataFn($scope.tableParams)
                };

                $scope.complexFn = function(e){
                    var target = e.target,
                        val = target[$rootScope.var.attr]('data-val');
                    $rootScope.fnSet.tab(target);
                    $scope.params.group_type = val;
                    actuallyContestService.chartsData($scope.params).success(function(data){chartFn(data)});

                };
                $scope.tableDataFn = function(e){
                    var target = e.target,
                        val = target[$rootScope.var.attr]('data-val');
                    $rootScope.fnSet.tab(target);
                    $scope.tableParams.to_date = val;
                    if(val == 4){
                        $scope.dateLayer = true;
                    }else{
                        $scope.dateLayer = false;
                        tableDataFn($scope.tableParams)
                        cakeCharPost();
                    }

                };
                $scope.dateFn = function(){
                    $scope.tableParams.time1 = $scope.date.begin;
                    $scope.tableParams.time2 = $scope.date.ends;
                    if($scope.tableParams.time1  && $scope.tableParams.time2){
                        console.log($scope.tableParams)
                        tableDataFn($scope.tableParams);
                        cakeCharPost();
                        $scope.dateLayer = false;
                    }else{ return}
                };
                $scope.someFn = function(e){
                    var target = e.target,
                        val = target[$rootScope.var.attr]('data-typeId');
                    $rootScope.fnSet.tab(target);
                    $scope.someParams.type_id = val;
                    console.log($scope.someParams)
                    actuallyContestService.competingData($scope.someParams).success(function(data) {
                        $scope.competingData = data.data;
                    });
                };
                $scope.certFn = function(cert_No){   
//                  var target = e.target,
//                      val = target.innerHTML;
                    		$scope.cert_No=cert_No;
                        $scope.certShow = 1;
                        $scope.isLoading =1;
                        $scope.certDetails =''; 
                        actuallyContestService.certDetailsData({
                            cert_No:cert_No,
                             house_id:$scope.houseId
                        }).success(function(data) {  
                            $scope.certDetails = data.data;
                            $scope.isLoading = 0;
                          
                        });
                    
                };
                $scope.someGo = function(e){
                    var target = e.target,
                        val = target[$rootScope.var.attr]('data-id');
                    if(target.nodeName == 'DD'){
                        $state.go("page.actually",{house_id:val});
                        window.scrollTo(0,0);
                    }

                };
                $scope.certClose = function(){
                    $scope.certShow = 0;
                };
                actuallyContestService.chartsData($scope.params).success(function(data){chartFn(data)});
                actuallyContestService.baseData($scope.params).success(function(data) {
                    $scope.beseData = data.data;
                    //console.log(data)
                });
                actuallyContestService.certData($scope.params).success(function(data) {
                    $scope.certData = data.data;
                    console.log(data)
                });

                actuallyContestService.competingData($scope.someParams).success(function(data) {
                    $scope.competingData = data.data;
                });
                tableDataFn($scope.tableParams);
                cakeCharPost();

            },1);

        });







    }]).controller('rankingContent',['$scope','$rootScope','$stateParams','rankingServices',function($scope,$rootScope,$stateParams,rankingServices){
        $rootScope.var.isSSHead = 0;
        $rootScope.isInfo = true;
        $rootScope.fnModule($stateParams,rankingServices,20,'rankingData');

    }]).controller('getLandContent',['$scope','$rootScope','$stateParams','getLandContestServices','$state',function($scope,$rootScope,$stateParams,getLandContestServices,$state){
        $rootScope.var.isSSHead = 0;
        //console.log($stateParams.blockId)
        setTimeout(function(){$rootScope.fnSet.attentionState(2)},0);
        $scope.dateLayer = false;
        $scope.blockId = $stateParams.blockId;
        getLandContestServices.getBlock({
            block_id:$stateParams.blockId
        }).success(function(data){
            function dataFn(config){
                getLandContestServices.getInfoPlate(config).success(function(data){
                    $scope.getInfoPlateData = data.data;
                });
            }

            $scope.getLandData = data.data;
            $scope.date = {};
            $scope.getLandData.video_web_url ==''? $scope.video = false : $scope.video = true ;


            setTimeout(function(){
                angular.element(document.querySelector('.video')).html('<embed  src="'+$scope.getLandData.video_web_url+'"  allowFullScreen="true" quality="high" width="857" height="466" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>');
            },0);
            $scope.config = {
                district_id: $scope.getLandData.district_id,
                plate_id: $scope.getLandData.plate_id,
                type_id: $scope.getLandData.type_id,
                to_date: $scope.getLandData.to_date
            };
            $scope.config.to_date = 1;
            console.log($scope.getLandData);


            getLandContestServices.getPlate({
                district_id: $scope.getLandData.district_id,
                plate_id: $scope.getLandData.plate_id
            }).success(function(data){
                $scope.getPlateData = data.data;
            });

            getLandContestServices.getWillSell({
                district_id: $scope.getLandData.district_id
            }).success(function(data){
                $scope.getWillSellData = data.data;
                console.log(data)
            });

            $scope.tabFn = function(e){
                var target = e.target,
                    val;
                val = target[$rootScope.var.attr]('data-val');
                $rootScope.fnSet.tab(target);
                getLandContestServices.getWillSell({
                    district_id: val
                }).success(function(data){
                    $scope.getWillSellData = data.data;
                });


            };

            $scope.willFn = function(e){
                var target = e.target,
                    val = target[$rootScope.var.attr]('data-blockId');
                target.classList.contains('getLand_td2') && $state.go("page.getLand",{blockId:val});


            };


            $scope.selectFn = function(e){
                var target = e.target,val;
                $rootScope.fnSet.tab(target);
                val = target[$rootScope.var.attr]('data-val');
                $scope.config.to_date = val;
                if(val == 4){
                    $scope.dateLayer = true;
                }else {
                    $scope.dateLayer = false;
                    dataFn($scope.config)
                }

            };
            $scope.dateFn = function(){
                $scope.config.time1 = $scope.date.begin;
                $scope.config.time2 = $scope.date.ends;
                if($scope.config.time1  && $scope.config.time2){
                    $scope.dateLayer = false;
                }else{ return}
            };
        });
        $rootScope.isInfo = true;

    }]).controller('designContent',['$scope','$rootScope','designServices','$stateParams',function($scope,$rootScope,designServices,$stateParams){
        $rootScope.isInfo = true;
        $rootScope.var.isSSHead = 0;
    //console.log($stateParams)
        $rootScope.fnModule($stateParams,designServices,10,'rankingData');

    }]).controller('marketingContent',['$scope','$rootScope','marketingServices','$stateParams',function($scope,$rootScope,marketingServices,$stateParams){
        $rootScope.isInfo = true;
        $rootScope.var.isSSHead = 0;

        $rootScope.fnModule($stateParams,marketingServices,10,'rankingData');


    }]).controller('superSearch',['$scope','$rootScope','superSearchServices','excel_Service','getLandServices',function($scope,$rootScope,superSearchServices,excel_Service,getLandServices){
        //初始化
        $rootScope.isInfo = true;
        $rootScope.var.isSSHead = 1; 
        $scope.searchParams = {};
        $scope.dataParams = {price1:null,price2:null,total_price1:null,total_price2:null,cj_time1:null,cj_time2:null,kp_time1:null,kp_time2:null,house_name:null};
        $scope.dataParams.hand = 1;
         $scope.dataParams.old = 1;
        $scope.dataParams.page =  0;
        $scope.isIf = {};

        getLandServices.getArea().success(function(data){
            $scope.areaList = data.data;
        });

        $scope.inputFn = function(){ 
            var inputs = document.querySelectorAll('.superSearch_if input'),
                i = 0,len = inputs.length,key=0;
            for(; i<len;i+=1){
                inputs[i].addEventListener('change',function(e){
                    key = e.target.parentNode.parentNode[$rootScope.var.attr]('data-key'); 
                    val = e.target.parentNode[$rootScope.var.attr]('data-val'); 
                    switch(key){
                        case 'price_type_id':
                       		 //单价自定义价格段  
                       		//如果两个段都填写了   
                       		//单价选项设为0，意思是自定义价格段
                       		$scope.dataParams.price_type_id = 0; 
                       		if(($scope.dataParams.price1!=0 && $scope.dataParams.price1!=null )&&($scope.dataParams.price2!=0&&$scope.dataParams.price2!=null )){
                       		     $scope.searchParams.price=$scope.dataParams.price1+'-'+$scope.dataParams.price2+'元';
                       			 $scope.toggleFn('price_type_id');
                       		}else{
                       			if($scope.dataParams.price1!=null &&$scope.dataParams.price1!=0 ){
	                       			$scope.searchParams.price='＞'+$scope.dataParams.price1+'元';
	                       			$scope.toggleFn('price_type_id');
                       			}else if($scope.dataParams.price2!=null &&$scope.dataParams.price2!=0 ){
	                       			$scope.searchParams.price=' ≤ '+$scope.dataParams.price2+'元';
	                       			$scope.toggleFn('price_type_id');
                       			}else{
                       				$scope.hidFn('price_type_id');  
                       			} 
                       		}  
                            break;
                        case 'total_price_type_id': 
							 //总价段自定义价格段  
                       		//如果两个段都填写了  
                       		//总价选项设为0，意思是自定义价格段
                       		$scope.dataParams.total_price_type_id = 0; 
                       		if(($scope.dataParams.total_price1!=0 && $scope.dataParams.total_price1!=null )&&($scope.dataParams.total_price2!=0&&$scope.dataParams.total_price2!=null )){
                       			$scope.searchParams.total_price=$scope.dataParams.total_price1+'-'+$scope.dataParams.total_price2+'万元';
                       			 $scope.toggleFn('total_price_type_id'); 
                       		}else{
                   				if($scope.dataParams.total_price1!=null &&$scope.dataParams.total_price1!=0 ){
                   					$scope.searchParams.total_price='＞'+$scope.dataParams.total_price1+'万元'; 
                   					$scope.toggleFn('total_price_type_id');
                   				}else if($scope.dataParams.total_price2!=null &&$scope.dataParams.total_price2!=0 ){
                       				$scope.searchParams.total_price=' ≤ '+$scope.dataParams.total_price2+'万元';
                       				$scope.toggleFn('total_price_type_id');
                       			}else{
                   				    $scope.hidFn('total_price_type_id');  
                   				} 
                       		}	 
                            break;
                        case 'kp_to_date':  
 							//自定义开盘时间查询 
                       		//如果两个段都填写了   
                       		$scope.dataParams.kp_to_date = val;
                       		if(($scope.dataParams.kp_time1!=null )&&($scope.dataParams.kp_time2!=null )){ 
                       		    $scope.searchParams.kp_date=$scope.dataParams.kp_time1.format("yyyy-MM-dd")+' 至 '+$scope.dataParams.kp_time2.format("yyyy-MM-dd");
                       			$scope.toggleFn('kp_to_date'); 
                       		}else{
                       			if($scope.dataParams.kp_time1!=null ){ 
	                       			$scope.searchParams.kp_date='＞'+$scope.dataParams.kp_time1.format("yyyy-MM-dd"); 
	                       			$scope.toggleFn('kp_to_date');
                       			}else if($scope.dataParams.kp_time2!=null  ){ 
	                       			$scope.searchParams.kp_date=' ≤ '+$scope.dataParams.kp_time2.format("yyyy-MM-dd");
	                       			$scope.toggleFn('kp_to_date');
                       			}else{
                       				$scope.dataParams.kp_to_date = 0;
                       				$scope.hidFn('kp_to_date');  
                       			}
                       		} 
                            break;
                        case 'cj_to_date':
                           //自定义成交时间查询 
                       		//如果两个段都填写了  
                       		$scope.dataParams.cj_to_date = val;
                       		if(($scope.dataParams.cj_time1!=null )&&($scope.dataParams.cj_time2!=null )){ 
                       			$scope.searchParams.cj_date=$scope.dataParams.cj_time1.format("yyyy-MM-dd")+' 至 '+$scope.dataParams.cj_time2.format("yyyy-MM-dd");
                       			 $scope.toggleFn('cj_to_date'); 
                       		}else{
                       			if($scope.dataParams.cj_time1!=null ){ 
                       				$scope.searchParams.cj_date='＞'+$scope.dataParams.cj_time1.format("yyyy-MM-dd"); 
                       				$scope.toggleFn('cj_to_date');
                       			}else if($scope.dataParams.cj_time2!=null  ){ 
                       				$scope.searchParams.cj_date=' ≤ '+$scope.dataParams.cj_time2.format("yyyy-MM-dd");
                       				$scope.toggleFn('cj_to_date');
	                       		}else{
	                       			$scope.dataParams.kp_to_date = 1;
	                       			$scope.hidFn('cj_to_date');  
	                       		} 
                       		}
                            break; 
                        case 'house_name':
                        		$scope.searchParams.house_name=$scope.dataParams.house_name;
                        		$scope.toggleFn('house_name');
							break;
                    }
                    

                })

            }

        }();

		//隐藏所选的条件标签
 		$scope.hidFn = function(key){
 			 var  ss_title = document.querySelector('.ss_title'),
                em = ss_title.getElementsByTagName('em');
                var i = 0, len = em.length;
                if(key==null){
	                	 for(;i<len;i+=1){
	                     em[i].style.display = "none";
	                }
                }else{
	                	 for(;i<len;i+=1){
	                    em[i][$rootScope.var.attr]('data-key') == key && (em[i].style.display = "none")
	                }
                }
               
            };
        $scope.superSFn = function(e){  
            var target = e.target,
                key = null,
                paramsKey = null,
                val = null,
                text = null,
                ss_title = document.querySelector('.ss_title'),
                em = ss_title.getElementsByTagName('em'),
                district_id,plate_id,ul,li,plateUl,
                cdf = document.createDocumentFragment();
			 
            $scope.isSSPlate = false;
            $scope.toggleFn = function(key){
                    var i = 0, len = em.length;
                    for(;i<len;i+=1){
                        em[i][$rootScope.var.attr]('data-key') == key && (em[i].style.display = "inline-block")
                    }
                }; 
                
            if(target.nodeName == 'I'){
                target.parentNode.style.display = "none";
                paramsKey = target.parentNode[$rootScope.var.attr]('data-key');
                $scope.dataParams[paramsKey] = '';
                switch(paramsKey){
                    case 'price_type_id':
                        $scope.dataParams.price1 = '';
                        $scope.dataParams.price2 = '';
                       
                        break;
                    case 'total_price_type_id':
                        $scope.dataParams.total_price1 = '';
                        $scope.dataParams.total_price2 = '';
                        break;
                    case 'kp_to_date':
                        $scope.dataParams.kp_time1 = null;
                        $scope.dataParams.kp_time2 = null;
                        break;
                    case 'to_date':
                        $scope.dataParams.cj_time1 = null;
                        $scope.dataParams.cj_time2 = null;
                        break;
                }

            }
            if(target.nodeName == "DD"){
                if(target.parentNode.classList.contains('ss_area')){
                    district_id = target[$rootScope.var.attr]('data-id');
                    $scope.isSSPlate = true;
                    $scope.dataParams.district_id = district_id;
                    $scope.searchParams.district = target.innerHTML;
                    $scope.searchParams.plate = '';
                    $scope.dataParams.plate_id = 0;
                    $scope.toggleFn('district_id');
                    getLandServices.getPlate({
                        district_id: district_id
                    }).success(function(data){
                        ul = document.querySelectorAll('.layer_area a');
                        plateUl = document.querySelector('.ss_plate');
                        angular.forEach(data.data,function(data){
                            li = '<dd data-plate='+data.plate_id+'>'+data.plate_name+'</dd>';
                            angular.element(cdf).append(li);
                        });

                        angular.element(plateUl).empty().append(angular.element(cdf));
                    });
                }
                if(target.parentNode.classList.contains('ss_plate')){
                    plate_id = target[$rootScope.var.attr]('data-plate');
                    $scope.dataParams.plate_id = plate_id;
                    $scope.searchParams.plate = target.innerHTML;
                    $scope.toggleFn('plate_id');
                }
            }
 
            if(target.nodeName == "SPAN"){ 
                key = target.parentNode[$rootScope.var.attr]('data-key');
                val = target[$rootScope.var.attr]('data-val');  
                text = target.innerHTML;  
              switch(key){
                  case 'build_type_id':
                      $scope.searchParams.build_type = text;
                      $scope.dataParams.build_type_id = val;
                      $scope.toggleFn('build_type_id');
                      break;
                  case 'house_type_id':
                      $scope.searchParams.house_type = text;
                      $scope.dataParams.house_type_id = val;
                      $scope.toggleFn('house_type_id');
                      break;
                  case 'loop_id':
                      $scope.searchParams.loop = text;
                      $scope.dataParams.loop_id = val;
                      $scope.toggleFn('loop_id');
                      break;
                  case 'selling_rate':
                      $scope.searchParams.selling_rate = text;
                      $scope.dataParams.selling_rate = val;
                      $scope.toggleFn('selling_rate');
                      break;
                  case 'volume_rate_id':
                      $scope.searchParams.volume_rate = text;
                      $scope.dataParams.volume_rate_id = val;
                      $scope.toggleFn('volume_rate_id');
                      break;
                  case 'price_type_id':
                      if(val != 6){
                          $scope.searchParams.price = text;
                          $scope.dataParams.price_type_id = val; 
                          //如果选择指定价格段，则自定义价格输入框清空
                          $scope.dataParams.price1=null;
                          $scope.dataParams.price2=null; 
                          $scope.toggleFn('price_type_id');
                      }
                      break;
                  case 'total_price_type_id':
                      if(val != 6) {
                          $scope.searchParams.total_price = text;
                          $scope.dataParams.total_price_type_id = val; 
                          //如果选择指定价格段，则自定义价格输入框清空
                          $scope.dataParams.total_price1=null;
                          $scope.dataParams.total_price2=null; 
                          $scope.toggleFn('total_price_type_id');
                      }
                      break;
                  case 'area_type_id':
                      $scope.searchParams.area_type = text;
                      $scope.dataParams.area_type_id = val;
                      $scope.toggleFn('area_type_id');
                      break;
                  case 'kp_to_date':
                      if(val != 5) {
                          $scope.searchParams.kp_date = text;
                          $scope.dataParams.kp_to_date = val; 
                          //如果选择指定开盘时间段，则自定义时间段入框清空
                          $scope.dataParams.kp_time1=null;
                          $scope.dataParams.kp_time2=null; 
                          $scope.toggleFn('kp_to_date');
                      }
                      break;
                  case 'cj_to_date':
                    if(val != 6) {
                          $scope.searchParams.cj_date = text;
                          $scope.dataParams.cj_to_date = val; 
                          $scope.dataParams.cj_time1=null;
                          $scope.dataParams.cj_time2=null; 
                          $scope.toggleFn('cj_to_date');
                      }
                      break;
              }
            }
        };
        $scope.tab = function(e){  
        	//一手 二手房切换
            var target = e.target,
                val = target[$rootScope.var.attr]('data-val');
            if(val == 2&&$scope.dataParams.hand!=2){ 
                $rootScope.isInfo = true;
                $scope.searchParams = {};
                $scope.dataParams = {price1:null,price2:null,total_price1:null,total_price2:null,cj_time1:null,cj_time2:null,kp_time1:null,kp_time2:null,house_name:null};
        			$scope.dataParams.old = 0;//如果是二手 控件隐藏
                $scope.dataParams.hand = 2;
       			$scope.dataParams.page =  0;
       			$scope.hidFn(null);
                
            }else if(val == 1&&$scope.dataParams.hand!=1){
               $rootScope.isInfo = true;
                $scope.searchParams = {};
                $scope.dataParams = {price1:null,price2:null,total_price1:null,total_price2:null,cj_time1:null,cj_time2:null,kp_time1:null,kp_time2:null,house_name:null};
        			$scope.dataParams.old = 1;//一手
                $scope.dataParams.hand = 1;
       			$scope.dataParams.page =  0;
       			$scope.hidFn(null);
            }
            $rootScope.fnSet.tab(target)
        };

        $scope.postDataFn = function(){
            $scope.dataParams.page=1;  
            $rootScope.fnModule($scope.dataParams,superSearchServices,20,'ssData','SScount');
        };
        //超级搜索下载
        $scope.postExcel_super_search = function(){  
           excel_Service.getExcel_super_search($scope.dataParams
).success(function(data){ 
       		    var type;
                type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                var headers='超级搜索下载excel';
                saveAs(new Blob([data], { type: type }), decodeURI( headers));  // 中文乱码 
            });
        };

    }]).controller('attention',['$scope','$rootScope','attentionServiyces','addAttentionServices',function($scope,$rootScope,attentionServices,addAttentionServices){
        $rootScope.isLogin = true;
        $rootScope.isInx = false;
        $rootScope.isInfo = false;
        $scope.attentionData = JSON.parse(localStorage.getItem('attentionData'));

        if(!localStorage.getItem('user')){
            $rootScope.var.loginState = 1;
            $rootScope.var.IsAtt = 0
        }
        $scope.arr = [];
        $scope.allCheckFn = function(){
            var table = document.querySelector('.attention_table'),
                check = table.querySelectorAll('.checkBoxs'),
                i = 0, len = check.length;
            if($scope.allCheck == true){
                for(;i<len;i+=1){
                    check[i].checked = true;
                    $scope.arr.push({
                        collect_id: check[i][$rootScope.var.attr]('data-id'),
                        collect_type: check[i][$rootScope.var.attr]('data-ctType')
                    })
                }
            }else{
                for(;i<len;i+=1){
                    check[i].checked = false;
                    $scope.arr=[]
                }
            }

        };
        $scope.cancelAllFn = function(){
            addAttentionServices.deleteData({
                registration_id: JSON.parse(localStorage.getItem('userData')).registration_id,
                collect_arr:$scope.arr
            }).success(function(data){
                attentionServices.getData({
                    registration_id : JSON.parse(localStorage.getItem('userData')).registration_id
                }).success(function(data){
                    console.log(data.data)
                    localStorage.setItem('attentionData',JSON.stringify(data.data));
                    location.reload()
                })
            })

        };
        var flag = 1;
        $scope.cancelFn = function(e){
            var target = e.target,
                val = target[$rootScope.var.attr]('data-id'),
                type = target[$rootScope.var.attr]('data-type'),
                ctType = target[$rootScope.var.attr]('data-ctType'),
                i= 0, len = $scope.arr.length;
            if(target.classList.contains('checkBoxs')){
                if(target.checked == true){
                    $scope.arr.push({
                        collect_id: val,
                        collect_type: ctType
                    });
                }else{
                    for (;i<len; i+=1) {
                        if($scope.arr[i].collect_id === val){
                            $scope.arr.splice(i, 1);
                            len = $scope.arr.length
                        }
                    }
                }
            }

           if(target.classList.contains('cancel')){
               if(flag){
                   flag = 0;
                   console.log(1)
                   addAttentionServices.deleteData({
                       registration_id: JSON.parse(localStorage.getItem('userData')).registration_id,
                       collect_arr:[{
                           collect_id: val,
                           collect_type:type
                       }]
                   }).success(function(data){
                       console.log(data);
                       flag = 1;
                       angular.element(target.parentNode).remove();

                       attentionServices.getData({
                           registration_id : JSON.parse(localStorage.getItem('userData')).registration_id
                       }).success(function(data){
                           console.log(data.data)
                           localStorage.setItem('attentionData',JSON.stringify(data.data));
                       })
                   });
               }

           }

        };



    }]).controller('about',['$scope','$rootScope',function($scope,$rootScope){
        $rootScope.isLogin = true;
        $rootScope.isInx = false;
        $rootScope.isInfo = false;
        !localStorage.getItem('user') && ($rootScope.var.loginState = 1);

    }]).controller('data',['$scope','$rootScope',function($scope,$rootScope){
        $rootScope.isLogin = true;
        $rootScope.isInx = false;
        $rootScope.isInfo = false;
        !localStorage.getItem('user') && ($rootScope.var.loginState = 1);


    }]).controller('downLoad',['$scope','$rootScope',function($scope,$rootScope){
        $rootScope.isInx = true;
        $rootScope.isLogin = false;
        $rootScope.isInfo = false;
    }]);
