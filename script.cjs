const fs = require("fs");
let c = fs.readFileSync("src/chapters/03-attention/AttentionChapter.tsx", "utf8");
let i1 = c.indexOf("<div className=\"a-global-formula-wrap\">");
let i2 = c.indexOf("<div className='a-global-formula-wrap'>");
console.log(i1, i2);
