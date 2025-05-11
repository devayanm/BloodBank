const io = require("../socket");

const sendCampNotification = (message) => {
  io.emit("newCamp", message);
};

const sendOrganNotification = (message) => {
  io.emit("newOrgan", message);
};

module.exports = { sendCampNotification, sendOrganNotification };
