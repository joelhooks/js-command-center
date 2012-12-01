describe("EventDispatcher", function() {
    it("should listen for events", function() {
        var eventDispatcher = new EventDispatcher(),
            wasCalled,
            callBackObject = {
                wasCalled: false,
                callBack: function() {
                    wasCalled = true;
                    console.log("SET WAS CALLED");
                }
            };

        eventDispatcher.addEventListener("TEST", callBackObject.callBack, callBackObject);
        eventDispatcher.dispatchEvent("TEST");
        expect(wasCalled).toBe(true);
    })
});