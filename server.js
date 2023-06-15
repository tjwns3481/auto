const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const fs = require("fs");
const desktopPath = "C:\\Users"
const rootDir = path.resolve(__dirname);
const publicDir = path.join(rootDir, "public");
const Cdrive = "C:\\Users"

// Set file name
const date = new Date();
const fullYear = date.getFullYear();
const realYear = fullYear.toString()[2] + fullYear.toString()[3];
const month = date.getMonth() + 1;
let realMonth = "";
const day = date.getDate();
const realDay = day.toString();
month < 10 ? (realMonth = "0" + month.toString()) : (realMonth = month.toString());
const realDate = realYear + realMonth + realDay;

app.use(express.static(__dirname + "/public")); // Serve static files from the 'public' directory

app.get("/mkdir", (req, res, next) => {
  console.log(`desktopPath = ${desktopPath}`);

  // Set ready dir
  fs.mkdir(`${desktopPath}/html_${realDate}sn_app`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(`${desktopPath}/html_${realDate}sn_app/css`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(`${desktopPath}/html_${realDate}sn_app/images`, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(`${desktopPath}/html_${realDate}sn_app/js`, { recursive: true }, (err) => {
    if (err) throw err;
  });
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

let extName = [];

const upload = multer({
  storage: multer.diskStorage({
    // Set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, `${desktopPath}/html_${realDate}sn_app/images`);
    },
    // convert a file name
    filename: (req, file, cb) => {
      extName.push(path.extname(file.originalname));
      cb(null, "img0" + req.files.length + path.extname(file.originalname));
    },
  }),
});

app.post("/upload", upload.array("image", 3), (req, res) => {
  console.log(extName);
  // Generate the new HTML file with the image tag
  const linkType = req.body.linkType;
  const linkUrl = req.body.linkUrl;
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
      <script src="./js/link.js"></script>
      <script>
        $(document).ready(function () {
          LinkSetting("link1", "${linkType}", "yes", "${linkUrl}");
        });
    </script>
    </head>
    <body>
      <div class="canvas">
        <div class="container">
          <div class="eventBox">
            <div class="img_box">
              <img src="./images/img01${extName[0]}" alt="Uploaded Image" />

              <a href="#none" id="link1">
                <img src="./images/img02${extName[1]}" alt="Uploaded Image" />
              </a>
              
              <img src="./images/img03${extName[2]}" alt="Uploaded Image" />
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
  img{width:100%; display:block}
  #link1 {display:block;}
  `;

  const newJs = `function LinkSetting(obj, type, newWindow, link_val) {
    var filter = "win16|win32|win64|mac|macintel";
  
    var pcweb_url = "";
    var moweb_url = "";
    var app_url = "";
  
    if (type == "coupon") {
      pcweb_url = "https://www.lotteshopping.com/cpn/cpnDetail?cpnInfoNo=";
      moweb_url = "https://m.lotteshopping.com/cpn/cpnDetail?cpnInfoNo=";
      app_url = "lottecoupon://gate?page=a0026&cpnInfoNo=";
    } else if (type == "shopping") {
      pcweb_url =
        "https://www.lotteshopping.com/shpgnews/shpgnewsDetail?shpgNewsNo=";
      moweb_url =
        "https://m.lotteshopping.com/shpgnews/shpgnewsDetail?shpgNewsNo=";
      app_url = "lottecoupon://gate?page=a0083&shpgNewsNo=";
    } else if (type == "saeun") {
      pcweb_url = "https://www.lotteshopping.com/thku/thkuDetail?thkuNo=";
      moweb_url = "https://m.lotteshopping.com/thku/thkuDetail?thkuNo=";
      app_url = "lottecoupon://gate?page=a0065&thkuNo=";
    } else if (type == "event") {
      pcweb_url = "https://www.lotteshopping.com/cuterent/cuterentDetail?entNo=";
      moweb_url = "https://m.lotteshopping.com/cuterent/cuterentDetail?entNo=";
      app_url = "lottecoupon://gate?page=a0102&entNo=";
    } else if (type == "magazine") {
      pcweb_url =
        "https://www.lotteshopping.com/magazine/magazineDetail?mazinNo=";
      moweb_url = "https://m.lotteshopping.com/magazine/magazineDetail?mazinNo=";
      app_url = "lottecoupon://gate?page=a0086&mazinNo=";
    } else if (type == "BrowserOpen") {
      pcweb_url = "";
      moweb_url = "";
      app_url = "toapp:::AppViewMove:::BrowserOpen:::";
    } else if (type == "xBrowser") {
      pcweb_url = "";
      moweb_url = "";
      app_url = "lottecoupon://gate?page=a0137&url=";
    }
  
    if (newWindow != "yes" || newWindow != "no") {
      newWindow = "yes";
    }
  
    if (navigator.platform) {
      if (filter.indexOf(navigator.platform.toLowerCase()) >= 0) {
        // PCWEB 인 경우
        $("#" + obj).prop("href", pcweb_url + link_val);
        if (newWindow == "yes") {
          $("#" + obj).prop("target", "_blank");
        }
      } else {
        var browserInfo = navigator.userAgent;
        var isInIFrame = window.location != window.parent.location;
  
        if (
          browserInfo.indexOf("LD_Android") > -1 ||
          browserInfo.indexOf("LD_iOS") > -1
        ) {
          // 앱 링크
          $("#" + obj).prop("href", app_url + link_val);
        } else {
          // 모바일 웹 링크
          $("#" + obj).prop("href", moweb_url + link_val);
          if (newWindow == "yes") {
            $("#" + obj).prop("target", "_blank");
          }
        }
      }
    }
  }
  `;

  // Write the new HTML file

  fs.writeFile(`${desktopPath}/html_${realDate}sn_app/index_app.html`, newHtml, (err) => {
    if (err) {
      console.err;
    } else {
      return res.send(`파일 생성이 완료되었습니다.<br/>
      rootDir = ${rootDir}<br/>
      publicDir = ${publicDir}<br/>
      c = ${Cdrive}<br/>
      desktopPath : ${desktopPath}`);
    }
  });

  // Write the new CSS file
  fs.writeFile(`${desktopPath}/html_${realDate}sn_app/css/event.css`, newCss, (err) => {
    if (err) {
      console.err;
    } else {
      return;
    }
  });

  // Write the new JS file
  fs.writeFile(`${desktopPath}/html_${realDate}sn_app/js/link.js`, newJs, (err) => {
    if (err) {
      console.err;
    } else {
      return;
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 8080");
});
