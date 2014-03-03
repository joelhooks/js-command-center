var jscc = jscc || {};
/**
 * Copyright 2010 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * jshashtable
 *
 * jshashtable is a JavaScript implementation of a hash table. It creates a single constructor function called Hashtable
 * in the global scope.
 *
 * Author: Tim Down <tim@timdown.co.uk>
 * Version: 2.1
 * Build date: 21 March 2010
 * Website: http://www.timdown.co.uk/jshashtable
 */

var Hashtable = (function () {
    var FUNCTION = "function";

    var arrayRemoveAt = (typeof Array.prototype.splice == FUNCTION) ?
        function (arr, idx) {
            arr.splice(idx, 1);
        } :

        function (arr, idx) {
            var itemsAfterDeleted, i, len;
            if (idx === arr.length - 1) {
                arr.length = idx;
            } else {
                itemsAfterDeleted = arr.slice(idx + 1);
                arr.length = idx;
                for (i = 0, len = itemsAfterDeleted.length; i < len; ++i) {
                    arr[idx + i] = itemsAfterDeleted[i];
                }
            }
        };

    function hashObject(obj) {
        var hashCode;
        if (typeof obj == "string") {
            return obj;
        } else if (typeof obj.hashCode == FUNCTION) {
            // Check the hashCode method really has returned a string
            hashCode = obj.hashCode();
            return (typeof hashCode == "string") ? hashCode : hashObject(hashCode);
        } else if (typeof obj.toString == FUNCTION) {
            return obj.toString();
        } else {
            try {
                return String(obj);
            } catch (ex) {
                // For host objects (such as ActiveObjects in IE) that have no toString() method and throw an error when
                // passed to String()
                return Object.prototype.toString.call(obj);
            }
        }
    }

    function equals_fixedValueHasEquals(fixedValue, variableValue) {
        return fixedValue.equals(variableValue);
    }

    function equals_fixedValueNoEquals(fixedValue, variableValue) {
        return (typeof variableValue.equals == FUNCTION) ?
            variableValue.equals(fixedValue) : (fixedValue === variableValue);
    }

    function createKeyValCheck(kvStr) {
        return function (kv) {
            if (kv === null) {
                return false;
            } else if (typeof kv == "undefined") {
                return false;
            }

            return true;
        };
    }

    var checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

    /*----------------------------------------------------------------------------------------------------------------*/

    function Bucket(hash, firstKey, firstValue, equalityFunction) {
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if (equalityFunction !== null) {
            this.getEqualityFunction = function () {
                return equalityFunction;
            };
        }
    }

    var EXISTENCE = 0, ENTRY = 1, ENTRY_INDEX_AND_VALUE = 2;

    function createBucketSearcher(mode) {
        return function (key) {
            var i = this.entries.length, entry, equals = this.getEqualityFunction(key);
            while (i--) {
                entry = this.entries[i];
                if (equals(key, entry[0])) {
                    switch (mode) {
                        case EXISTENCE:
                            return true;
                        case ENTRY:
                            return entry;
                        case ENTRY_INDEX_AND_VALUE:
                            return [ i, entry[1] ];
                    }
                }
            }
            return false;
        };
    }

    function createBucketLister(entryProperty) {
        return function (aggregatedArr) {
            var startIndex = aggregatedArr.length;
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                aggregatedArr[startIndex + i] = this.entries[i][entryProperty];
            }
        };
    }

    Bucket.prototype = {
        getEqualityFunction: function (searchValue) {
            return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
        },

        getEntryForKey: createBucketSearcher(ENTRY),

        getEntryAndIndexForKey: createBucketSearcher(ENTRY_INDEX_AND_VALUE),

        removeEntryForKey: function (key) {
            var result = this.getEntryAndIndexForKey(key);
            if (result) {
                arrayRemoveAt(this.entries, result[0]);
                return result[1];
            }
            return null;
        },

        addEntry: function (key, value) {
            this.entries[this.entries.length] = [key, value];
        },

        keys: createBucketLister(0),

        values: createBucketLister(1),

        getEntries: function (entries) {
            var startIndex = entries.length;
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                // Clone the entry stored in the bucket before adding to array
                entries[startIndex + i] = this.entries[i].slice(0);
            }
        },

        containsKey: createBucketSearcher(EXISTENCE),

        containsValue: function (value) {
            var i = this.entries.length;
            while (i--) {
                if (value === this.entries[i][1]) {
                    return true;
                }
            }
            return false;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Supporting functions for searching hashtable buckets

    function searchBuckets(buckets, hash) {
        var i = buckets.length, bucket;
        while (i--) {
            bucket = buckets[i];
            if (hash === bucket[0]) {
                return i;
            }
        }
        return null;
    }

    function getBucketForHash(bucketsByHash, hash) {
        var bucket = bucketsByHash[hash];

        // Check that this is a genuine bucket and not something inherited from the bucketsByHash's prototype
        return ( bucket && (bucket instanceof Bucket) ) ? bucket : null;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    function Hashtable(hashingFunctionParam, equalityFunctionParam) {
        var that = this;
        var buckets = [];
        var bucketsByHash = {};

        var hashingFunction = (typeof hashingFunctionParam == FUNCTION) ? hashingFunctionParam : hashObject;
        var equalityFunction = (typeof equalityFunctionParam == FUNCTION) ? equalityFunctionParam : null;

        this.put = function (key, value) {
            var isValidKey = checkKey(key),
                hash, bucket, bucketEntry, oldValue = null;

            if (isValidKey === false) {
                return null;
            }

            checkValue(value);

            hash = hashingFunction(key);

            // Check if a bucket exists for the bucket key
            bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it already contains this key
                bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so replace old value and we're done.
                    oldValue = bucketEntry[1];
                    bucketEntry[1] = value;
                } else {
                    // The bucket does not contain an entry for this key, so add one
                    bucket.addEntry(key, value);
                }
            } else {
                // No bucket exists for the key, so create one and put our key/value mapping in
                bucket = new Bucket(hash, key, value, equalityFunction);
                buckets[buckets.length] = bucket;
                bucketsByHash[hash] = bucket;
            }
            return oldValue;
        };

        this.get = function (key) {
            var isValidKey = checkKey(key),
                hash;

            if (isValidKey === false) {
                return null
            }

            hash = hashingFunction(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                // Check this bucket to see if it contains this key
                var bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    // This bucket entry is the current mapping of key to value, so return the value.
                    return bucketEntry[1];
                }
            }
            return null;
        };

        this.containsKey = function (key) {
            var isValidKey = checkKey(key),
                bucketKey;

            if (isValidKey === false) {
                return false;
            }

            bucketKey = hashingFunction(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, bucketKey);

            return bucket ? bucket.containsKey(key) : false;
        };

        this.containsValue = function (value) {
            if (value === undefined || value === null) {
                return false;
            }

            checkValue(value);
            var i = buckets.length;
            while (i--) {
                if (buckets[i].containsValue(value)) {
                    return true;
                }
            }
            return false;
        };

        this.clear = function () {
            buckets.length = 0;
            bucketsByHash = {};
        };

        this.isEmpty = function () {
            return !buckets.length;
        };

        var createBucketAggregator = function (bucketFuncName) {
            return function () {
                var aggregated = [], i = buckets.length;
                while (i--) {
                    buckets[i][bucketFuncName](aggregated);
                }
                return aggregated;
            };
        };

        this.keys = createBucketAggregator("keys");
        this.values = createBucketAggregator("values");
        this.entries = createBucketAggregator("getEntries");

        this.remove = function (key) {
            var isValidKey = checkKey(key),
                hash, bucketIndex, oldValue = null;

            if (isValidKey === false) {
                return null;
            }

            hash = hashingFunction(key);

            // Check if a bucket exists for the bucket key
            var bucket = getBucketForHash(bucketsByHash, hash);

            if (bucket) {
                // Remove entry from this bucket for this key
                oldValue = bucket.removeEntryForKey(key);
                if (oldValue !== null) {
                    // Entry was removed, so check if bucket is empty
                    if (!bucket.entries.length) {
                        // Bucket is empty, so remove it from the bucket collections
                        bucketIndex = searchBuckets(buckets, hash);
                        arrayRemoveAt(buckets, bucketIndex);
                        delete bucketsByHash[hash];
                    }
                }
            }
            return oldValue;
        };

        this.size = function () {
            var total = 0, i = buckets.length;
            while (i--) {
                total += buckets[i].entries.length;
            }
            return total;
        };

        this.each = function (callback) {
            var entries = that.entries(), i = entries.length, entry;
            while (i--) {
                entry = entries[i];
                callback(entry[0], entry[1]);
            }
        };

        this.putAll = function (hashtable, conflictCallback) {
            var entries = hashtable.entries();
            var entry, key, value, thisValue, i = entries.length;
            var hasConflictCallback = (typeof conflictCallback == FUNCTION);
            while (i--) {
                entry = entries[i];
                key = entry[0];
                value = entry[1];

                // Check for a conflict. The default behaviour is to overwrite the value for an existing key
                if (hasConflictCallback && (thisValue = that.get(key))) {
                    value = conflictCallback(key, thisValue, value);
                }
                that.put(key, value);
            }
        };

        this.clone = function () {
            var clone = new Hashtable(hashingFunctionParam, equalityFunctionParam);
            clone.putAll(that);
            return clone;
        };
    }

    return Hashtable;
})();
var EventDispatcher;

(function() {
    "use strict";
    /**
     * Minimal event dispatcher
     * @see http://stackoverflow.com/q/7026709/87002
     * @constructor
     */
    EventDispatcher = function EventDispatcher() {

        var listeners = {};

        this.addEventListener = function (event, listener, context) {
            if (listeners.hasOwnProperty(event)) {
                listeners[event].push([listener, context]);
            } else {
                listeners[event] = [
                    [listener, context]
                ];
            }
        };

        this.removeEventListener = function (event, listener) {
            var i;
            if (listeners.hasOwnProperty(event)) {
                for (i in listeners[event]) {
                    if (listeners[event][i][0] == listener) {
                        listeners[event].splice(i, 1);
                        return true;
                    }
                }
            }

            return false;
        };

        this.dispatchEvent = function (type) {
            var i;
            if (type && listeners.hasOwnProperty(type)) {
                for (i in listeners[type]) {
                    if (typeof listeners[type][i][0] == 'function') {
                        listeners[type][i][0].call(listeners[type][i][1], event);
                    }
                }
            }
        };
    };
}());
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
(function() {
    "use strict";


  angular.module('command-map', [])

    .factory('commandMap', function (dispatcher, AngularCommandTrigger) {
      /**
       * CommandMap to be used within an AngularJS application.
       *
       * @param {Object} commandCenter CommandCenter instance
       * @constructor
       */
      jscc.AngularCommandMap = function AngularCommandMap(commandCenter) {
        var createTrigger,
          triggers = new Hashtable();

        /**
         * Accepts an event string to listen for. Is followed by
         * `toCommand` to map to a Command object.
         *
         * `commandMap.map('myCommandTriggerEvent').toCommand(commands.MyCommand);`
         *
         * @param {String} eventType
         * @return {*}
         */
        this.map = function (eventType) {

          if (typeof eventType === 'undefined') {
            throw new Error("cannot map undefined.");
          }

          var trigger = triggers.get(eventType);

          if (!trigger) {
            trigger = createTrigger(eventType);
            triggers.put(eventType, trigger);
          }

          return commandCenter.map(trigger);
        };

        /**
         * This will unmap a command from the given event string. Is followed by
         * `fromCommand` to map to a Command object.
         *
         * `commandMap.unmap('myCommandTriggerEvent').fromCommand(commands.MyCommand);`
         *
         * @param {String} eventType
         * @return {*}
         */
        this.unmap = function (eventType) {
          var trigger = triggers.get(eventType);
          return commandCenter.unmap(trigger);
        };

        createTrigger = function (type) {
          return new AngularCommandTrigger(type);
        };
      };

      return new AngularCommandMap(new jscc.CommandCenter())
    })
  ;
}());
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
(function () {
    "use strict";
    jscc.CommandCenter = function CommandCenter() {
        var mappings = new Hashtable(),
            nullUnmapper = {
                fromCommand: function (commandConstructor) {

                },
                fromAll: function () {

                }
            };

        this.map = function (trigger) {
            var mapper = mappings.get(trigger);

            if (!mapper) {
                mappings.put(trigger, new jscc.CommandMapper(trigger));
                mapper = mappings.get(trigger);
            }

            return mapper;
        };

        this.unmap = function (trigger) {
            var mapping = mappings.get(trigger);

            if (mapping) {
                return mapping;
            }

            return nullUnmapper;
        };
    };

}());
(function () {
    "use strict";
    /**
     * Describes a fluent interface for mapping and unmapping commands.
     *
     * @param trigger
     * @constructor
     */
    jscc.CommandMapper = function CommandMapper(trigger) {
        var mappings = new Hashtable(),
            createMapping,
            deleteMapping,
            overwriteMapping;

        /**
         * Used after `commandMap.map('event')` to specify the command
         * object that will be instantiated when an event of the given type
         * is received.
         *
         * @param {Function} commandConstructor
         * @return {*}
         */
        this.toCommand = function (commandConstructor) {
          if (typeof commandConstructor === 'undefined') {
            throw new Error("cannot map event to undefined.");
          }

          var mapping;

          if (mappings.containsKey(commandConstructor)) {
            mapping = mappings.get(commandConstructor);
          }

          return mapping ? overwriteMapping(mapping) : createMapping(commandConstructor);
        };

        /**
         * Used after `commandMap.unmap('event')` to specify the command
         * object that will be removed from the event supplied.
         *
         * @param {Function} commandConstructor
         * @return {*}
         */
        this.fromCommand = function (commandConstructor) {
            var mapping = mappings.get(commandConstructor);
            if (mapping) {
                deleteMapping(mapping);
            }
        };

        /**
         * Will remove ALL mappings for the given trigger.
         *
         * `commandMap.unmap('event').fromAll();`
         */
        this.fromAll = function () {
            mappings.each(function (key, value) {
                deleteMapping(value);
            });
        };

        createMapping = function (commandConstructor) {
            var mapping = new jscc.CommandMapping(commandConstructor);
            trigger.addMapping(mapping);
            mappings.put(commandConstructor, mapping);
            return mapping;
        };

        deleteMapping = function (mapping) {
            trigger.removeMapping(mapping);
            mappings.remove(mapping.commandConstructor);
        };

        overwriteMapping = function (mapping) {
            deleteMapping(mapping);
            return createMapping(mapping.commandConstructor);
        };
    };
}());
(function() {
    "use strict";
    /**
     * Defines an individual mapping of a constructor function.
     *
     * @param commandConstructor
     * @constructor
     */
    jscc.CommandMapping = function CommandMapping(commandConstructor) {
        this.commandConstructor = commandConstructor;

        this.fireOnce = false;

        /**
         * If passed true, this mapping will only be triggered a single time
         * and then it will be discarded.
         *
         * @param {boolean|undefined} isOnce
         * @return {*}
         */
        this.once = function(isOnce) {
            if(isOnce === undefined) {
                isOnce = true;
            }
            this.fireOnce = isOnce;
            return this;
        };
    };
}());
(function () {
    "use strict";
    jscc.CommandMappingList = function CommandMappingList() {
        this.head = null;
        this.tail = null;

        this.add = function (node) {
            if (this.tail) {
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;
            } else {
                this.head = this.tail = node;
            }
        };

        this.remove = function (node) {
            if (node === this.head) {
                this.head = this.head.next;
            }

            if (node === this.tail) {
                this.tail = this.tail.previous;
            }

            if (node.previous) {
                node.previous.next = node.next;
            }

            if (node.next) {
                node.next.previous = node.previous;
            }

        };
    };
}());
(function() {
    "use strict";
    jscc.EventCommandExecutor = function EventCommandExecutor(trigger, mappings, injector) {
        this.execute = function(eventType) {
            var mapping = mappings.head,
                command;

            while(mapping) {
                command = new mapping.commandConstructor();
                if(command) {
                    if(mapping.fireOnce) {
                        trigger.removeMapping(mapping);
                    }
                    command.execute();
                }
                mapping = mapping.next;
            }
        };
    };
}());
(function() {
    "use strict";
    jscc.EventCommandMap = function EventCommandMap(injector, dispatcher, commandCenter) {
        var createTrigger,
            triggers = new Hashtable();

        this.map = function(eventType) {
            var trigger = triggers.get(eventType);

            if(!trigger) {
                trigger = createTrigger(eventType);
                triggers.put(eventType, trigger);
            }

            return commandCenter.map(trigger);
        };

        createTrigger = function(type) {
            return new jscc.EventCommandTrigger(injector, dispatcher, type);
        };
    };
}());
(function() {
    "use strict";
    jscc.EventCommandTrigger = function EventCommandTrigger(injector, dispatcher, type) {
        var verifyCommand,
            addListener,
            removeListener,
            mappings = new jscc.CommandMappingList(),
            executor = new jscc.EventCommandExecutor(this, mappings, injector);

        this.addMapping = function(mapping) {
            verifyCommand(mapping);
            if (!mappings.head) {
                addListener();
            }
            mappings.add(mapping);
        };

        this.removeMapping = function(mapping) {
            mappings.remove(mapping);
            if(!mappings.head) {
                removeListener();
            }
        };

        verifyCommand = function(mapping) {
            var execute = mapping.commandConstructor.prototype.execute;
            if(!execute) {
                throw new Error("No execute() method on CommandMapping");
            }
        };

        addListener = function() {
            dispatcher.addEventListener(type, executor.execute);
        };

        removeListener = function() {
            dispatcher.removeEventListener(type, executor.execute);
        };
    };
}());