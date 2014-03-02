Sometimes it's nice to use a global event bus in your applications. This dispatcher wraps a bit of the eventing functionality from $rootScope to create an event bus that other actors in your application can use.

## DispatchingController

The dispatching controller is a *mixin* for your controllers to enhance their behavior.

``` javascript
/**
 * This is how you'd use the dispatcher  
 */
.controller('myController', function ($scope, DispatchingController) {
              var time = new Date();
 
              // `this` scope can be an issue here. It might be 
              // required to assign `var myController = this` 
              // in some cases.
              //
              // this could be `angular.extend` vs the Object.mixin ;)
              angular.extend(this, new DispatchingController($scope));
 
              this.listen('hi', function (event, msg) {
                console.log('event handled:', time, msg, event);
              });
 
              this.dispatch('hi', 'from controller')
            })
.service('myService', function(dispatch) {
  dispatch('hi', 'from service');
})
```