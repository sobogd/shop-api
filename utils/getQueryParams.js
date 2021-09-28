export const getQueryParams = (queryInfo, queryName) => {
  let returnParams = "";

  queryInfo?.operation?.selectionSet?.selections?.forEach((selection) => {
    if (selection.name.value === queryName) {
      returnParams = selection.selectionSet.selections
        .map((param) => param.name.value)
        .join(" ");
    }
  });

  return returnParams;
};
