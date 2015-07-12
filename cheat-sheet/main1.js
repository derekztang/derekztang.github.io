(function(){

  var app = angular.module('gitCheat', ['ui.router']);

  app.run( ['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);


  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/create");

    var pages = ['create', 'local-changes', 'commit-history', 'branches-tags', 'update-publish', 'merge-rebase', 'undo'];

    for (var i = 0; i < pages.length; i++) {
      var obj = {
        name: pages[i],
        url: '/'+pages[i],
        templateUrl: 'partials/'+pages[i]+'.html'
      };
      $stateProvider.state(obj);
    };

  });

})();