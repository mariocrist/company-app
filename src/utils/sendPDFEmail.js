import { jsPDF } from "jspdf";
// importar cliente axios
import clienteAxios from "../config/axios";

const sendPDFEmail = (target, name, orientation, resize,email, debug) => {

  if (resize) {
    document.querySelector(target).style.width =
      orientation === "p" ? "600px" : "841px";
    document.querySelector(target).style.minHeight =
      orientation === "p" ? "841px" : "595px";
  }

  let pdf = new jsPDF(orientation, "pt", "a4",true);

  pdf.html(document.querySelector(target), {
    callback: () => {
      //convert to uriStrint
      var out = pdf.output('datauristring');
      clienteAxios.post('/email/send', {
        pdf: out.split('base64,')[1],
        email: email
      }).then((res) => {
          if(res.status === 'ok') console.log("ENVIO MAIL FUNCIONANDO!");
          else console.log(":( ERROR ENVIO MAIL");
      });
      if (resize) {
        document.querySelector(target).style = "";
      }
    },
  });
};
export { sendPDFEmail };