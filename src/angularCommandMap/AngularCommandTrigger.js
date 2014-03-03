(function() {
    "use strict";


  angular.module('AngularCommandTrigger', [])
    .factory('AngularCommandTrigger', function (dispatcher, AngularCommandExecutor) {
      /**
       * Handles event listening for the CommandMap. Generally no need to access
       * this object directly.
       *
       * @param injector
       * @param scope
       * @param type
       * @constructor
       */
      jscc.AngularCommandTrigger = function AngularCommandTrigger(type) {
        var verifyCommand,
          addListener,
          removeListener,
          mappings = new jscc.CommandMappingList(),
          executor = new AngularCommandExecutor(this, mappings);

        this.addMapping = function (mapping) {
          verifyCommand(mapping);
          if (!mappings.head) {
            addListener();
          }
          mappings.add(mapping);
        };

        this.removeMapping = function (mapping) {
          mappings.remove(mapping);
          if (!mappings.head) {
            removeListener();
          }
        };

        verifyCommand = function (mapping) {
          var execute = mapping.commandConstructor.prototype.execute;
          if (!execute) {
            throw new Error("No execute() method on CommandMapping");
          }
        };

        addListener = function () {
          dispatcher.addEventListener(type, executor.execute);
        };

        removeListener = function () {
          dispatcher.removeEventListener(type, executor.execute);
        };
      };

      return AngularCommandTrigger
    })
  ;
}());