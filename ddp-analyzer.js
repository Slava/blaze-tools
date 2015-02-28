ReactiveVar = Package['reactive-var'].ReactiveVar;
LocalCollection = Package['minimongo'].LocalCollection;
_ = Package['underscore']._;

Connections = new LocalCollection();
Messages = new LocalCollection();

var handleMessage = function (o) {
  if (! Connections.findOne({ name: o.name })) {
    Connections.insert({ name: o.name });
  }

  Messages.insert(_.extend(o, {
    ts: new Date
  }));
};

setInterval(function () {
  inject('DDPAnalyzer.DevTools.getBuffered()', function (err, buffer) {
    if (err) {
      console.error(err);
      return;
    }

    for (var i = 0; i < buffer.length; i++) {
      handleMessage(buffer[i]);
    }
  });
}, 500);

Template.main.helpers({
  connections: function () {
    return Connections.find();
  }
});

Template.ddpMessages.helpers({
  messages: function () {
    var connection = this.connection.name;
    return Messages.find({ name: connection }, { sort: { ts: -1 } });
  }
});

