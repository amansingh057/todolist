//jshint esversion:6

exports.getDate = function() {
  var today = new Date();
  day = "weekend";
  // var arr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);

  return day
}
function getDay() {
  var today = new Date();
  day = "weekend";
  var options = {
    weekday: "long"
  };
  var day = today.toLocaleDateString("en-US", options);

  return day
}
module.exports.getDay = getDay
