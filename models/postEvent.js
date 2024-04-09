(() => {
  const postEvent = (topic, category, by, date) => {
    return {
      Topic: topic,
      Category: category,
      "Posted By": by,
      Date: date,
      postedAt: new Date().getUTCDate(),
    };
  };
  module.exports = postEvent;
})();
