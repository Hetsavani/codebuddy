document.addEventListener("sendChromeData", function (evt) {
  const { sourceCode } = evt.detail;

  if (window.monaco) {
    window.monaco.editor.getModels()[0].setValue(sourceCode);
  } else {
    console.log("Monaco not found");
  }
});