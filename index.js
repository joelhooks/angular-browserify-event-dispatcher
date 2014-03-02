module.exports = angular.module('event-dispatcher', [])
/**
 * This factory provides a constructor to mixin with an
 * AngularJS controller constructor. It provides some
 * syntax sugar for making memory-leak safe eventing.
 */
  .factory('DispatchingController', function ($rootScope) {
    function DispatchingController($scope) {
      var delisteners = [];

      if (!$scope) {
        throw new Error("A DispatchingController must have $scope to function. It wasn't found.")
      }

      this.dispatch = $rootScope.$emit.bind($rootScope);

      this.listen = function () {
        var args = Array.prototype.slice.call(arguments),
          deListenFunc = $rootScope.$on.apply($rootScope, args);
        delisteners.push(deListenFunc);
        return deListenFunc;
      };

      $scope.$on('$destroy', function () {
        delisteners.forEach(function (deListenFunc) {
          if(_.isFunction(deListenFunc)) {
            deListenFunc.call();
          }
        })
      })
    }

    return DispatchingController;
  })
/**
 * This factory provides a `dispatch` function as
 * an injectable. The dispatch function is a wrapper
 * around $rootScope.$emit, but allows us to inject
 * just the single piece of functionality we want
 * into ANY service/factory/etc and facilitate event
 * dispatching.
 */
  .factory('dispatch', function (Dispatcher) {
    var dispatcher = new Dispatcher();
    return dispatcher.dispatch;
  })
/**
 * This factor creates a Dispatcher constructor. This can
 * be used as a method for mixing in dispatching capabilities.
 */
  .factory('Dispatcher', function($rootScope) {
    function Dispatcher() {}

    Dispatcher.prototype.dispatch = function () {
      var args = Array.prototype.slice.call(arguments);
      $rootScope.$emit.apply($rootScope, args);
    };

    return Dispatcher;
  })
;

