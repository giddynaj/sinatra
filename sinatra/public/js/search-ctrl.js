var searchCtrl= function($scope, $http){
  $scope.results = [];
  $scope.query = '';
  $scope.search= function(query){
       var dataObject = { 'query' : query }
       var responsePromise = $http.post('http://ec2-54-149-45-86.us-west-2.compute.amazonaws.com:8080/search',dataObject,{})
       responsePromise.success(function(dataFromServer, status, headers, config){
        $scope.results = dataFromServer['results']
       });
       responsePromise.error(function(data, status, headers, config){
         alert("Submitting form failed!");
       });
  };
};
                




