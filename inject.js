inject = function (script, cb) {
  if (! window.chrome.devtools) {
    if (script.match(/start/))
      cb();
    else if (script.match(/stop/))
      cb(null, stubData);
    return;
  }
  chrome.devtools.inspectedWindow.eval(script, function (res, exc) {
    if (exc && exc.isError) {
      cb(exc.description, null);
    } else if (exc && exc.isException) {
      cb(exc.value, null);
    } else
      cb(null, res);
  });
}

var stubData = [{"aveTime":158,"totalTime":158,"recomputations":1,"funcName":"DynamicTemplate:materialize","_id":"937"},{"aveTime":22,"totalTime":22,"recomputations":1,"funcName":"DynamicTemplateanonymous","_id":"936"},{"aveTime":8,"totalTime":16,"recomputations":2,"funcName":"Template.menuItem:updater","_id":"607"},{"aveTime":9,"totalTime":9,"recomputations":1,"funcName":"onLocationChange","_id":"27"},{"aveTime":3.5,"totalTime":7,"recomputations":2,"funcName":"with:setData","_id":"31"},{"aveTime":1,"totalTime":2,"recomputations":2,"funcName":"Spacebars_withanonymous","_id":"82"},{"aveTime":1,"totalTime":2,"recomputations":2,"funcName":"lookup:getSetting:materialize","_id":"68"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"if:condition","_id":"4698"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"if:updater","_id":"4687"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:name:materialize","_id":"4684"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"Spacebars_withanonymous","_id":"4664"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:_:materialize","_id":"4653"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:_:materialize","_id":"4649"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"Template.menuItem:updater","_id":"4591"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"with:setData","_id":"4571"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:checkContext:materialize","_id":"4548"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:_:materialize","_id":"4537"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"with:setData","_id":"4515"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"lookup:_:materialize","_id":"4509"},{"aveTime":0.5,"totalTime":1,"recomputations":2,"funcName":"if:condition","_id":"4473"}];


