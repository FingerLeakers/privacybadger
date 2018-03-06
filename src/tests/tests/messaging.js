/* globals badger:false */

(function () {

  let constants = require('constants');

  // Test messaging between tabs and the background
  QUnit.module("messaging", {
    beforeEach: function () {

      this.SITE_URL = "http://example.com/";
      this.tabId = -1;

      badger.recordFrame(this.tabId, 0, -1, this.SITE_URL);

      // stub chrome.tabs.get manually as we have some sort of issue stubbing with Sinon in Firefox
      this.chromeTabsGet = chrome.tabs.get;
      chrome.tabs.get = (tab_id, callback) => {
        return callback({
          active: true
        });
      };
    },

    afterEach: function () {
      chrome.tabs.get = this.chromeTabsGet;
      delete badger.tabData[this.tabId];
    }
  });

  /*
  QUnit.test("seenComic", function(assert) {
    let done = assert.async(2);
    let stub = sinon.stub(badger, "getSettings");
    stub.returns({ 
      setItem: function (item, val) { 
        console.log("setting item");
        assert.equal(item, "seenComic"); 
        done();
      } 
    });
     
    chrome.runtime.sendMessage({type: "seenComic"});
    stub.restore();
  });
  */


  QUnit.test("getPopupData response", function(assert) {
    let done = assert.async();

    chrome.runtime.sendMessage({
      type: "getPopupData",
      tabId: this.tabId,
      tabUrl: this.SITE_URL
    }, (response) => {
      assert.deepEqual(Object.keys(response).sort(), [
        "criticalError",
        "enabled",
        "isPrivateWindow",
        "noTabData",
        "origins",
        "seenComic",
        "tabHost",
        "tabId",
        "tabUrl"
      ]);
      done();
    });
  });

  QUnit.test("revertDomainControl response", function(assert) {
    let done = assert.async();

    chrome.runtime.sendMessage({
      type: "revertDomainControl",
      origin: this.SITE_URL
    }, (response) => {
      assert.deepEqual(Object.keys(response), ["action"]);
      done();
    });
  });

}());
