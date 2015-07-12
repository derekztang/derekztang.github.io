(function(){
  var app = angular.module('andySite', ['ui.router', 'ngAnimate']);

  app.run( ['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    });
  }])

  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider.state({
      name: 'home',
      url: '/',
      templateUrl: 'partials/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    });

    var pages = ['about-me', 'blog', 'education', 'portfolio', 'contact'];

    for (var i = 0; i < pages.length; i++) {
      var obj = {
        name: pages[i],
        url: '/'+pages[i],
        templateUrl: 'partials/'+pages[i]+'.html'
      };
      $stateProvider.state(obj);
    };

    var blogs = [
      's1-teixobactin',
      's2-prop-65',
      's3-chemophobia',
      't1-git-blog',
      't2-css-design',
      't3-arrays-hashes',
      't4-enumerable-methods',
      't5-ruby-classes',
      't6-array-proc',
      't7-javascript',
      't8-tech',
      'c1-chefs-kitchen',
      'c3-thinking-style',
      'c4-tech-issues',
      'c5-feedback',
      'c6-stereotype-threat',
      'c9-completions',
      'c10-snippets',
      'c11-aliases',
      'c12-feminism'
    ];

    for (var i = 0; i < blogs.length; i++) {
      var obj = {
        name: blogs[i],
        url: '/blog/'+blogs[i],
        templateUrl: 'blog/'+blogs[i]+'.html',
        controller: 'AsideController',
        controllerAs: 'aside'
      };
      $stateProvider.state(obj);
    };

  });

  app.controller('HomeController', function() {
    this.tab = 0
  });

  app.controller('AsideController', function($state) {
    this.tab = $state.current.name[0]
  });

})();

$(document).ready(function() {
  $('.menu').click(function() {
    $('nav a').slideToggle();
  });

  $('#contact').click(function() {
    $('#contact-menu').animate({
      top: "80px"
    }, 200);
  });

  $('#close').click(function() {
    $('#contact-menu').animate({
      top: "-400px"
    }, 200);
  });
});