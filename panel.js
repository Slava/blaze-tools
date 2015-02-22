LocalCollection = Package.minimongo.LocalCollection;
ReactiveVar = Package['reactive-var'].ReactiveVar;
debug = new ReactiveVar();
Data = new LocalCollection();

Template.main.helpers({
  stuff: function () {
    return Data.find();
  },
  debug: function () {
    return JSON.stringify(debug.get(), null, 2);
  }
});

Template.main.events({
  'click #start': function () {
    inject('TrackerProfiler.start()', function (err, res) {
      if (err)
        debug.set(err);
    });
    return false;
  },
  'click #stop': function () {
    inject('TrackerProfiler.stop()', function (err, res) {
      if (err)
        debug.set(err)
      else
        debug.set(res);
    });
    return false;
  }
});

Meteor.startup(function () {
  Data.insert({});
  Data.insert({});
  Data.insert({});
  Data.insert({});
});

function inject (script, cb) {
  chrome.devtools.inspectedWindow.eval(script, function (res, exc) {
    if (exc.isError) {
      cb(exc.description, null);
    } else if (exc.isException) {
      cb(exc.value, null);
    } else
      cb(null, res);
  });
}

