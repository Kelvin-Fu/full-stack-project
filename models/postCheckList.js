(() => {
  const postCheckList = (checkListItems, checkBoxesStatus, category, user) => {
    return {
      checkListItems,
      checkBoxesStatus,
      "Posted By": user,
      Category: category,
      postedAt: new Date().getUTCDate(),
    };
  };
  module.exports = postCheckList;
})();
