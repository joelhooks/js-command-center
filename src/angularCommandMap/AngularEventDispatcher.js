(function () {
  "use strict";



  angular.module('AngularEventDispatcher', [])
    .factory('dispatcher', function(AngularEventDispatcher) {
      return new AngularEventDispatcher();
    })
    .factory('AngularEventDispatcher', function ($rootScope) {
      jscc.AngularEventDispatcher = function AngularEventDispatcher() {
        var remove = {};

        this.addEventListener = function (type, listener, context) {
          var args = Array.prototype.slice.call(arguments);
          if(typeof remove[type] === 'function') {
            remove[type].call();
          }
          remove[type] = $rootScope.$on.apply($rootScope, args);
          return remove[type];
        };

        this.removeEventListener = function (type) {
          if (remove[type]) {
            remove[type].call();
            delete remove[type];
            return true;
          }

          return false;
        };

        this.dispatchEvent = $rootScope.$emit.bind($rootScope);
      };

      return AngularEventDispatcher
    })
  ;
})();