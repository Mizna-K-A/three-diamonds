import { jsPDF } from "jspdf";
import fs from "fs";

try {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  const arrBuf = doc.output('arraybuffer');
  const buf = Buffer.from(arrBuf);
  console.log("PDF generated, size:", buf.length);
} catch (e) {
  console.error(e);
}
