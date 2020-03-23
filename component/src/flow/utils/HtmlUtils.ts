export const checkboxChange = (handler: (checked: boolean) => void) => (e: Event) => handler((e.target as HTMLInputElement).checked);

export const inputFileChange = (handler: (checked: any) => void) => (e: Event) => handler((e.target as HTMLInputElement).files);

export const textareaChange = (handler: (value: string) => void) => (e: Event) => handler((e.target as HTMLInputElement).value);


export const moveCursorToTheEnd = (domNode: Node) => {
  const range = document.createRange();
  range.selectNodeContents(domNode);
  range.collapse(false);

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
