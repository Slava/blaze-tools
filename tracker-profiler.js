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

var tp = 'Package["slava:tracker-profiler"].';
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

