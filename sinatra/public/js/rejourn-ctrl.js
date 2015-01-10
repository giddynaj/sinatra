var newsContentCtrl = function($scope, initializer,$http,$timeout){
  $scope.jobs=[];
  $scope.news= {contents: [initializer[0].content],
                class_legend: {0:'content'},
                content_classes: [0],
                title: initializer[0].title,
                updated_ts: initializer[0].updated_ts,
                id: initializer[0].id,
                tags: 'list'
  } ;

  function getJob(jobID){
   var job;    
   for (var jobCan in $scope.jobs){
    if ($scope.jobs[jobCan].job_id == jobID){
      job = $scope.jobs[jobCan];
      break;
    } 
   }
  return job;
  }

  function updateJob(jobID,update){
   var job;    
   var updateKeys = Object.keys(update);
   job = getJob(jobID);
   for (var i in updateKeys){
   job[updateKeys[i]] = update[updateKeys[i]];
   }
  }

  function pushJob(jobID){
    var timeout = ""
    var poller = function(){
      //fire another request
      $http.get('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/results/'+jobID).
        success(function(data, status, headers, config){
          if(status === 202){
            updateJob(jobID,{'status': 'still loading...'}); 
          } else if (status === 200){
            updateJob(jobID,{'results':data, 'status':'done'}); 
            if (typeof $timeout != "undefined"){
            $timeout.cancel(timeout);
            } 
            return false;
          }
       
        // continue to call the poller() function every 2 seconds
        // until the timeout is cancelled
        timeout = $timeout(poller,2000);
        });
    };
    poller();
  }

  $scope.getArticleFromJobID = function(jobID){
       var job = getJob(jobID);
       
       var responsePromise = $http.get('http://localhost:4567/' + job.news_id)
         responsePromise.success(function(dataFromServer, status, headers, config){
             $scope.news= {contents: job.results.sentences,
             class_legend: job.results.class_legend,
             content_classes: job.results.classes,
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
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/tokenize_sent',dataObject,{})


       responsePromise.success(function(dataFromServer, status, headers, config){
           if (dataFromServer.job_id){
           job = {'news_id' : $scope.news.id,'request_type':'sentence parse', 'job_id':dataFromServer.job_id, 'results':'', 'status':'initial'}
           $scope.jobs.push(job);
           pushJob(job.job_id);
           } else {
           $scope.news.class_legend = dataFromServer.class_legend;
           $scope.news.contents = dataFromServer.sentences;
           $scope.news.content_classes = dataFromServer.classes;
           $scope.news.tags = 'list';
           }
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.entities = function(){
       var dataObject = { content : $scope.news.contents }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/entities',dataObject,{})

       responsePromise.success(function(dataFromServer, status, headers, config){
           $scope.news.class_legend = dataFromServer.class_legend;
           $scope.news.contents = dataFromServer.tokens;
           $scope.news.pos_tags = dataFromServer.pos_tags;
           $scope.news.content_classes = dataFromServer.classes;
           $scope.news.tags = 'inline';
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.sent_sentences = function(){
       var dataObject = { request_type: 'sentences', content : $scope.news.contents, classes : $scope.news.content_classes }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/get_sent',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };
   
  //request_type,class_legend, classes, pos_tags, content
  $scope.sent_iobs = function(){
       var dataObject = { request_type: 'entities', class_legend: $scope.news.class_legend, content : $scope.news.contents, pos_tags : $scope.news.pos_tags, classes : $scope.news.content_classes }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/get_iobs',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.pos = function(){
       var dataObject = { content : $scope.news.contents }
//       var responsePromise = $http.post('http://localhost:8080/tokenize_sent',dataObject,{})
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/assign_pos',dataObject,{})


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
   if ($scope.news.contents[i] == "EOL") {
     return 'eol';
   } else {
     return $scope.news.tags;
   }
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

