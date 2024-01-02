import { PDFDocument } from "./node_modules/pdf-lib/dist/pdf-lib.esm.min.js";
let textAreaContainer = null;
let signatureText = null;
var displaySignature = document.createElement("div");
document.body.appendChild(displaySignature);

document.getElementById("addSignature").addEventListener("click", function () {
  if (textAreaContainer) {
    if (textAreaContainer.style.display === "none") {
      textAreaContainer.style.display = "flex";
    } else {
      textAreaContainer.style.display = "none";
    }
  } else {
    textAreaContainer = document.createElement("div");
    textAreaContainer.className = "textAreaContainer";
    const textArea = document.createElement("input");
    textArea.type = "text";
    textArea.placeholder = "Enter your signature here";
    textArea.className = "textAreaField";
    textArea.rows = 2;
    textAreaContainer.appendChild(textArea);
    document.body.appendChild(textAreaContainer);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.className = "saveButton";

    saveButton.addEventListener("click", function () {
      signatureText = textArea.value;
      console.log("Signature Text:", signatureText);
      displaySignature.className = "displaySignature";
      displaySignature.textContent = "Signature Text: " + signatureText;
      textArea.value = " ";
      textAreaContainer.style.display = "none";
    });

    textAreaContainer.appendChild(textArea);
    textAreaContainer.appendChild(saveButton);
    document.body.appendChild(textAreaContainer);
  }
});

document.getElementById("sighpdf").addEventListener("click", async function () {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const existingPdf = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdf);
    const lastPageIndex = pdfDoc.getPageCount() - 1;
    const lastPage = pdfDoc.getPage(lastPageIndex);
    const bottomLeftX = 50;
    const bottomLeftY = 50;

    lastPage.drawText(signatureText, {
      x: bottomLeftX,
      y: bottomLeftY,
      fontSize: 12,
    });

    const modifiedPdf = await pdfDoc.save();
    const blob = new Blob([modifiedPdf], { type: "application/pdf" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "signed_document.pdf";
    downloadLink.click();
  } else {
    alert("Please select a PDF file and enter text.");
  }
});
