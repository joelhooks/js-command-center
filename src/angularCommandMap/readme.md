# Angular Command Map

*requires:* [AngularJS](http://angularjs.org)

CommandMap for use with AngularJS.

## Basic Usage

This assumes we are using the "Angular Seed" project with the `js-command-map.js` provided as a dependency
to that project.

```html
  <script src="lib/angular/angular.js"></script>
  <script src="lib/js-command-center.js"></script>
```


The first step is to create the commands module and create a provider for the command map.
This will allow for it to be injected:

```javascript
(function () {
    'use strict';

    var modules = angular.module('myApp.commands', []);

    var commandMapProvider = {
        $get: ['$rootScope', '$injector', function ($rootScope, $injector) {
            return new jscc.AngularCommandMap($injector, $rootScope, new jscc.CommandCenter());
        }]
    };

    modules.provider('commandMap', commandMapProvider);
}());
```

This then needs to be declared in `app.js` so that Angular will know where to find it:

```javascript
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.commands']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
  ```

With that set, we now need to define some commands. In this case, we've added a "root" controller
to the root angular view:

```html
<div ng-view data-ng-controller="root"></div>
```

and in the `controllers.js` we will map the command:

```javascript
function root(commandMap) {
    console.log(commandMap)
    var myCommandOne = function myCommandOne() {

    }

    myCommandOne.prototype.execute = function ($rootScope, params) {
        console.log("Command from:", params.id)
    }

    commandMap.map("test").toCommand(myCommandOne);
}


function MyCtrl1($rootScope) {
    $rootScope.$broadcast("test", {id: "1"})
}
MyCtrl1.$inject = ['$rootScope'];


function MyCtrl2($rootScope) {
    $rootScope.$broadcast("test", {id:"2"})
}
MyCtrl2.$inject = ['$rootScope'];
```

Note also that the `MyCtrl1` and `MyCtrl2` have `$rootScope` injected into them. `$rootScope` is being
used as the event bus for the commands. The second argument of the `$broadcast` off of `$rootScope` will
be delivered to the `execute` method of the command as the `params` injectable.

