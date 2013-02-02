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