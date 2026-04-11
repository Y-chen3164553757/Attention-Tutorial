const fs = require('fs');
let c = fs.readFileSync('src/chapters/03-attention/AttentionChapter.tsx', 'utf-8');
let parts = c.split(/<div className='a-global-formula-wrap'>[\s\S]*?<\/div>[\s\n]*<\/div>[\s\n]*<\/div>/);
if(parts.length > 1) {
    fs.writeFileSync('src/chapters/03-attention/AttentionChapter.tsx', parts[0] + '</div>\n\n        <div className=\"a-deck\">\n          <AnimatePresence mode=\'wait\'>' + c.split(/<AnimatePresence mode='wait'>/)[1]);
}
