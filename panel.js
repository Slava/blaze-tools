ReactiveVar = Package['reactive-var'].ReactiveVar;
_ = Package['underscore']._;
debug = new ReactiveVar();
started = new ReactiveVar(false);
data = new ReactiveVar([]);
sortProp = new ReactiveVar('totalTime');

Template.main.helpers({
  debug: function () {
    return JSON.stringify(debug.get(), null, 2);
  },
  started: function () {
    return started.get();
  }
});

var tp = 'Package["tracker-profiler"].';
Template.main.events({
  'click #start': function () {
    inject(tp + 'TrackerProfiler.start()', function (err, res) {
      if (err)
        debug.set(err);
      else
        started.set(true);
    });
    return false;
  },
  'click #stop': function () {
    inject(tp + 'TrackerProfiler.stop()', function (err, res) {
      if (err) {
        debug.set(err)
      } else {
        data.set(res);
      }
    });

    started.set(false);
    return false;
  },
  'change input': function (e) {
    sortProp.set(e.target.id);
    return false;
  }
});

var colors = _.shuffle(randomColors(1000));
var sum = function (a) {
  return _.reduce(a, function(memo, num){ return memo + num; }, 0);
}

var getData = function () {
  var res = data.get();
  res = _.groupBy(res, 'funcName');
  var i = 0;
  res = _.map(res, function (group, name) {
    return {
      name: name,
      values: _.pluck(group, sortProp.get())
    };
  });
  res = _.sortBy(res, function (group) {
    return -sum(group.values);
  });
  // XXX this hackery should be removed once we have @index
  _.each(res, function (x, i) { x.i = i; });
  return res;
};
Template.chart.helpers({
  rows: function () {
    return getData();
  },
  offset: function () {
    return this.i * (60 + 5);
  },
  maxSum: function () {
    return _.max(_.map(getData(), function (row) {
      return sum(row.values);
    }));
  }
});

Template.row.helpers({
  orderedValues: function () {
    return _.map(this.data.values, function (v, i) {
      return {
        value: v,
        i: i
      };
    });
  },
  offset: function () {
    var p = Template.instance().data;
    return sum(p.data.values.slice(0, this.i)) / p.maxUnit * p.maxWidth;
  },
  width: function () {
    var p = Template.instance().data;
    return this.value / p.maxUnit * p.maxWidth;
  },
  color: function () {
    var p = Template.instance().data;
    return colors[this.i % colors.length];
  }
});

function randomColors(total) {
  var r = [];
  for (var x=0; x<total; x++) {
    r.push(Math.random() * 360);
  }
  return r;
}

function inject (script, cb) {
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

