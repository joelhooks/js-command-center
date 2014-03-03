(function() {
  "use strict";
  angular.module('AngularCommandExecutor', [])
    .factory('AngularCommandExecutor', function ($injector, dispatcher) {
      jscc.AngularCommandExecutor = function AngularCommandExecutor(trigger, mappings) {
        this.execute = function (eventType, params) {
          var mapping = mappings.head,
            command;

          while (mapping) {
            command = $injector.instantiate(mapping.commandConstructor, {params: params, event: eventType});
            command.dispatch = dispatcher.dispatchEvent;
            if (command) {
              if (mapping.fireOnce) {
                trigger.removeMapping(mapping);
              }

              if (!command.execute.hasOwnProperty('$inject')) {
                command.execute.$inject = ['params'];
              }

              $injector.invoke(command.execute, command, {params: params, event: eventType});
              if (command.destroy && command.autoDestroy()) {
                command.destroy();
              }
              command.dispatch = null;
            }
            mapping = mapping.next;
          }
        };
      };
      return AngularCommandExecutor
    })
  ;
}());