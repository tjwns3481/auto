const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const fs = require("fs");

// set file name
const date = new Date();
const fullYear = date.getFullYear();
const realYear = fullYear.toString()[2] + fullYear.toString()[3];
const month = date.getMonth() + 1;
let realMonth = "";
const day = date.getDate();
const realDay = day.toString();
month < 10 ? (realMonth = "0" + month.toString()) : (realMonth = month.toString());
const realDate = realYear + realMonth + realDay;

app.use(express.static("public")); // Serve static files from the 'public' directory

fs.mkdir(`uploads/html_${realDate}sn_app`, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir(`uploads/html_${realDate}sn_app/css`, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir(`uploads/html_${realDate}sn_app/images`, { recursive: true }, (err) => {
  if (err) throw err;
});

const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, `uploads/html_${realDate}sn_app/images`);
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, "img02" + path.extname(file.originalname));
    },
  }),
});

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("filepath = " + req.file.path);
  const imagePath = req.file.path; // Path to the uploaded image
  const imageUrl = "/" + imagePath; // Relative URL of the image

  // Generate the new HTML file with the image tag
  const newHtml = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      />
      <meta name="format-detection" content="telephone=no" />
      <title>이벤트</title>
  
      <link rel="stylesheet" href="./css/event.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    </head>
    <body>
      <div class="canvas">
        <div class="container">
          <div class="eventBox">
            <div class="img_box">
            <img src="./images/img02.jpg" alt="Uploaded Image" />
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  const newCss = `
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;}
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {display: block;}
  body {line-height: 1;}
  ol, ul {list-style: none;}
  blockquote, q {quotes: none;}
  blockquote:before, blockquote:after,
  q:before, q:after {content: '';content: none;}
  table {border-collapse: collapse;border-spacing: 0;}
  .eventBox {width:100%; overflow-x:hidden;}
  `;

  // Write the new HTML file

  fs.writeFile(`uploads/html_${realDate}sn_app/index_app.html`, newHtml, (err) => {
    if (err) {
      // console.err;
    } else {
      return res.send("HTML file generated successfully");
    }
  });

  // Write the new CSS file

  fs.writeFile(`uploads/html_${realDate}sn_app/css/event.css`, newCss, (err) => {
    if (err) {
      console.err;
    } else {
      return;
    }
  });

  fs.opendir(
    // Path of the directory
    `${__dirname}`,

    // Options for modifying the operation
    { encoding: "utf8", bufferSize: 64 },

    // Callback with the error and returned
    // directory
    (err, dir) => {
      if (err) console.log("Error:", err);
      else {
        // Print the pathname of the directory
        console.log("Path of the directory:", dir.path);

        // Close the directory
        console.log("Closing the directory");
        dir.closeSync();
      }
    }
  );
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
