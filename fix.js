const fs = require("fs");
let c = fs.readFileSync("src/chapters/03-attention/AttentionChapter.tsx", "utf-8");
c = c.replace(/<div className=.a-global-formula-wrap.>((.|\n|\r)*?)<\/div>\s*<\/div>\s*<\/div>/, "</div>\n        </div>");
fs.writeFileSync("src/chapters/03-attention/AttentionChapter.tsx", c);
