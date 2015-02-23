ReactiveVar = Package['reactive-var'].ReactiveVar;
_ = Package['underscore']._;
debug = new ReactiveVar();
data = new ReactiveVar([]);

Template.main.helpers({
  debug: function () {
    return JSON.stringify(debug.get(), null, 2);
  }
});

var tp = 'Package["tracker-profiler"].';
Template.main.events({
  'click #start': function () {
    inject(tp + 'TrackerProfiler.start()', function (err, res) {
      if (err)
        debug.set(err);
    });
    return false;
  },
  'click #stop': function () {
    inject(tp + 'TrackerProfiler.stop()', function (err, res) {
      if (err)
        debug.set(err)
      else {
        res = _.groupBy(res, 'funcName');
        res = _.map(res, function (group, name) {
          return {
            name: name,
            values: _.pluck(group, 'totalTime')
          };
        });
        data.set(res);
      }
    });
    return false;
  }
});

var colors = _.shuffle(randomColors(1000));
var sum = function (a) {
  return _.reduce(a, function(memo, num){ return memo + num; }, 0);
}

Template.chart.helpers({
  rows: function () {
    return data.get();
  },
  offset: function () {
    return _.indexOf(data.get(), this) * (60 + 5);
  },
  maxSum: function () {
    return _.max(_.map(data.get(), function (row) {
      return sum(row.values);
    }));
  }
});

Template.row.helpers({
  offset: function (p) {
    var index = _.indexOf(p.data.values, this.valueOf());
    return sum(p.data.values.slice(0, index)) / p.maxUnit * p.maxWidth;
  },
  width: function (p) {
    return this.valueOf() / p.maxUnit * p.maxWidth;
  },
  color: function (p) {
    var index = _.indexOf(p.data.values, this.valueOf());
    return colors[index % colors.length];
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
      cb(null, [{"aveTime":154,"totalTime":154,"recomputations":1,"funcName":"DynamicTemplate:materialize","_id":"937"},{"aveTime":8,"totalTime":16,"recomputations":2,"funcName":"if:condition","_id":"732"}]);
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

