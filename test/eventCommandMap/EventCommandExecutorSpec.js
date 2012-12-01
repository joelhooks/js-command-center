/*global describe, beforeEach, it, expect, EventCommandMap, EventCommandExecutor, EventDispatcher, CommandCenter */
describe("EventCommandExecutor", function() {
    "use strict";

    var executor,
        injector,
        dispatcher,
        commandMap,
        EVENT_ONE = "EVENT_ONE",
        SimpleCommand,
        wasExecuted;

    beforeEach(function() {
        injector = {};
        dispatcher = new EventDispatcher();
        commandMap = new EventCommandMap(injector, dispatcher, new CommandCenter());
        executor = new EventCommandExecutor();
        SimpleCommand = function SimpleCommand() {
            wasExecuted = false;
        };
        SimpleCommand.prototype.execute = function() {
            wasExecuted = true;
        };
    });
//eventCommandMap.map(SupportEvent.TYPE1, SupportEvent).toCommand(CallbackCommand).once(oneshot);
    it("should be constructed", function() {
        expect(executor.constructor).toBe(EventCommandExecutor);
    });

    it("should execute command", function() {
        commandMap.map(EVENT_ONE).toCommand(SimpleCommand);
        dispatcher.dispatchEvent(EVENT_ONE);
        expect(wasExecuted).toBe(true);
    });
});