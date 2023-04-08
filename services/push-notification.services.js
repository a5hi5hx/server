const dotenv = require("dotenv");
dotenv.config();
const appId = process.env.one_signal_appID;
const apiKey = process.env.one_signal_ApiKey;

async function sendNotification(data, callback) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic " + apiKey,
  };
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers,
  };
  var https = require("https");
  var req = https.request(options, function (res) {
    res.on("data", function (data) {
      console.log(JSON.parse(data));
      return callback(null, JSON.parse(data));
    });
  });

  req.on("error", function (e) {
    return callback({
      message: e,
    });
  });

  req.write(JSON.stringify(data));
  req.end();
}

module.exports = { sendNotification };
