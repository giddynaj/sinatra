var newsContentCtrl = function($scope, initializer,$http){
  $scope.news= {contents: [initializer[0].content],
             class_legend: {0:'content'},
                content_classes: [0],
                title: initializer[0].title,
                updated_ts: initializer[0].updated_ts,
                id: initializer[0].id,
                tags: 'list'
  } ;

  $scope.previous = function(i){
       var responsePromise = $http.get('http://localhost:4567/' + (i - 1))
         responsePromise.success(function(dataFromServer, status, headers, config){
             $scope.news= {contents: [dataFromServer.content],
             class_legend: {0:'content'},
             content_classes: [0],
             title: dataFromServer.title,
             updated_ts: dataFromServer.updated_ts,
             id: dataFromServer.id,
             tags: 'list'
           } ;
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Getting Previous failed!");
       });

  }
                
  $scope.next= function(i){
       var responsePromise = $http.get('http://localhost:4567/' + (i + 1))
         responsePromise.success(function(dataFromServer, status, headers, config){
             $scope.news= {contents: [dataFromServer.content],
             class_legend: {0:'content'},
             content_classes: [0],
             title: dataFromServer.title,
             updated_ts: dataFromServer.updated_ts,
             id: dataFromServer.id,
             tags: 'list'
           } ;
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Getting Next failed!");
       });

  }

  $scope.sentences = function(){
       var dataObject = { content : $scope.news.contents[0] }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tokenize_sent',dataObject,{})


       responsePromise.success(function(dataFromServer, status, headers, config){
           $scope.news.class_legend = dataFromServer.class_legend;
           $scope.news.contents = dataFromServer.sentences;
           $scope.news.content_classes = dataFromServer.classes;
           $scope.news.tags = 'list';
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.entities = function(){
       var dataObject = { content : $scope.news.contents }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/entities',dataObject,{})

       responsePromise.success(function(dataFromServer, status, headers, config){
           $scope.news.class_legend = dataFromServer.class_legend;
           $scope.news.contents = dataFromServer.tokens;
           $scope.news.content_classes = dataFromServer.classes;
           $scope.news.tags = 'inline';
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.sent_sentences = function(){
       var dataObject = { content : $scope.news.contents, classes : $scope.news.content_classes }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/get_sent',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.pos = function(){
       var dataObject = { content : $scope.news.contents }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/assign_pos',dataObject,{})


       responsePromise.success(function(dataFromServer, status, headers, config){
           $scope.news.class_legend = dataFromServer.class_legend;
           $scope.news.contents = dataFromServer.tokens;
           $scope.news.content_classes = dataFromServer.classes;
           $scope.news.tags = 'inline';
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.itemIn = function(i){
    return $scope.news.class_legend[$scope.news.content_classes[i]];
  };

  $scope.typeTag = function(i){
    //if ($scope.news.class_legend[$scope.news.content_classes[i]] != ".") {
     return $scope.news.tags;
   // } else {
   //  return 'list';
   // }
  };

  $scope.itemClicked = function(i){
    $scope.news.content_classes[i] = ($scope.news.content_classes[i] + 1)  % (Object.keys($scope.news.class_legend).length);
  }

 };
newsContentCtrl.$inject = ['$scope','newsContentInitializer','$http'];

rejornApp.controller('newsContentCtrl',newsContentCtrl).
directive("myDirective",
  function(){
    return {
      template:'<span ng-class="{itemIn(\'{{$index}}\'): true }" ng-click="itemClicked(\'{{$index}}\')">{{content}}</div>',
      restrict: "A",
      }
    }
);

