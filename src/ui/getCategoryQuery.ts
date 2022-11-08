const editable = (t: HTMLInputElement) => {
  if (t.selectionStart !== t.selectionEnd) return "";
  const caret = t.selectionStart;
  if (caret === null || caret === 0) return "";
  return t.value.slice(0, caret).match(/(^|\s)(\S*)$/)?.[2] || "";
};

const getCategoryQuery = (target?: HTMLInputElement) => {
  if (!target) return;
  return (editable(target).match(/^@(\w*)$/) || [])[1];
};

export default getCategoryQuery;
