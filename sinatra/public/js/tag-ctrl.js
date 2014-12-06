var tagCtrl= function($scope, $http){
  $scope.add_tag = '';
  $scope.keys = [];
  $scope.tags = [];
  $scope.hashes = [];
  $scope.tag_results = 0;
  $scope.context = '';


  $scope.set_things = function(query){
     if (query.indexOf(":") > -1) { 
     $scope.set_hash(query);
     } else {
     $scope.set_tags(query);
     }
  }

  $scope.get_things = function(context){
     $scope.get_tags($scope.context);
  }

  $scope.get_context = function(key){
     $scope.context = key.split(":")[1];
     $scope.get_tags($scope.context);
     $scope.get_hash($scope.context);
  }
 
  $scope.get_keys= function(){
       var responsePromise = $http.get('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',{ params: {'keys' : 'True'}})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.keys = dataFromServer['kmembers']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.set_tags= function(query){
       var dataObject = { 'context' : $scope.context, 'tag' : query }
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.tag_results = dataFromServer['results']
        $scope.tags = dataFromServer['members']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };
  $scope.set_hash= function(query){
       var dataObject = { 'context' : $scope.context, 'tag' : query }
       var responsePromise = $http.post('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.tag_results = dataFromServer['results']
        $scope.hash_keys = Object.keys(dataFromServer['hmembers'])
        $scope.hashes = dataFromServer['hmembers']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };
  $scope.get_tags= function(context){
       var dataObject = { 'context' : context }
       var responsePromise = $http.get('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',{ params: {'context' : context}})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.tag_results = dataFromServer['results']
        $scope.tags = dataFromServer['members']
        $scope.hash_keys = Object.keys(dataFromServer['hmembers'])
        $scope.hashes = dataFromServer['hmembers']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  $scope.del_tags= function(query){
       var dataObject = { params : { 'context' : $scope.context, 'tag' : query  }}
       var responsePromise = $http.delete('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',dataObject)
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.tag_results = dataFromServer['results']
        $scope.tags = dataFromServer['members']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };

  function init(){ 
    $scope.get_keys();
  }

  init();

};
                




