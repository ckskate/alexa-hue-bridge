var fs = require('fs');
var hue = require('node-hue-api');
var HueApi = hue.HueApi;
var lightState = hue.lightState;

const BRIDGE_PATH = "bridge.conf";


class Lights {

  constructor() {
    this.api = new HueApi();
    this.bulbs = [];
    this.initializeBridge();
    this.state = lightState.create();
  }

  setOnTo(val) {
    var setTo = (val) ? this.state.on() : this.state.off();
    for (var i = 0; i < this.bulbs.length; i++) {
      this.api.setLightState(this.bulbs[i], setTo).done();
    }
  }

  setBrightnessTo(val) {
    for (var i = 0; i < this.bulbs.length; i++) {
      this.api.setLightState(this.bulbs[i], this.state.brightness(val)).done();
    }
  }

  incrementBrightnessBy(val) {
    for (var i = 0; i < this.bulbs.length; i++) {
      this.api.setLightState(this.bulbs[i], this.state.incrementBrightness(val)).done();
    }
  }

  incrementColorTempBy(val) {
    for (var i = 0; i < this.bulbs.length; i++) {
      this.api.setLightState(this.bulbs[i], this.state.ct_inc(val)).done();
    }
  }

  initializeBridge() {
    var self = this;
    // see if the conf file exists
    fs.stat(BRIDGE_PATH, function(err, stat) {
      if (err == null) {
        // we're in luck, it exists
        var conf = JSON.parse(fs.readFileSync(BRIDGE_PATH, 'utf8'));
        self.api = new HueApi(conf["ipaddress"], conf["username"]);
        self.getBulbList();
      } else {
        // if the lookup hasn't happened before, find the
        // bridge and save the info.
        hue.nupnpSearch(function(err, result) {
          var conf = result[0];
          self.api.createUser(conf["ipaddress"], function(err, user) {
            if (err) throw err;

            conf["username"] = user;
            fs.writeFile(BRIDGE_PATH, JSON.stringify(conf), (err) => {});
            self.api = new HueApi(conf["ipaddress"], conf["username"]);
            self.getBulbList();
          });
        });
      }
    });
  }

  getBulbList() {
    var self = this;
    this.api.lights(function(err, lights) {
      if (err) throw err;
      for (var i = 0; i < lights["lights"].length; i++) {
        self.bulbs.push(parseInt(lights["lights"][i]["id"]));
      }
      console.log(self.bulbs);
    });
  }
}

module.exports.Lights = Lights;
