var tagCtrl= function($scope, $http){
  $scope.add_tag = '';
  $scope.tags = [];
  $scope.tag_results = 0;
  $scope.context = '';

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
  $scope.get_tags= function(context){
       var dataObject = { 'context' : context }
       var responsePromise = $http.get('http://ec2-54-213-216-43.us-west-2.compute.amazonaws.com:8080/tags',{ params: {'context' : context}})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.tag_results = dataFromServer['results']
        $scope.tags = dataFromServer['members']
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
};
                




