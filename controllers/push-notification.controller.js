const dotenv = require("dotenv");
dotenv.config();
const appId = process.env.one_signal_appID;
const apiKey = process.env.one_signal_ApiKey;
const pushNotificationService = require("../services/push-notification.services");

exports.SendAddNotification = (req, res, next) => {
  var message = {
    app_id: appId,
    contents: { en: "New Pet Added. Tap to adopt!!" },
    included_segments: ["All"],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "AdoptMe-Rehome a Pet",
    },
  };

  pushNotificationService.sendNotification(message, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "success",
      data: results,
    });
  });
};

exports.SendBookNotification = (req, res, next) => {
  var message = {
    app_id: appId,
    contents: { en: "Your pet has been booked. View the booking now." },
    include_player_ids: [req.body.devices],
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "AdoptMe-Rehome a Pet",
    },
  };

  pushNotificationService.sendNotification(message, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "success",
      data: results,
    });
  });
};
