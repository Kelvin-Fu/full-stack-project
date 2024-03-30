(() => {
  const Log = (method, path, query, status) => {
    return {
      Timestamp: new Date().getUTCDate(),
      Method: method,
      Path: path,
      Query: query,
      "Status Code": status,
    };
  };
  module.exports = Log;
})();
