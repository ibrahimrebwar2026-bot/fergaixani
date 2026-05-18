import fs from 'fs';

const file = 'src/App.tsx';
let txt = fs.readFileSync(file, 'utf8');

const start = txt.indexOf("                   {adminSubTab === 'lessons' && (");
if (start !== -1) {
    const endSnippet = "              </motion.div>\n            ) : activeTab === 'translator' ? (";
    const end = txt.indexOf(endSnippet, start);
    
    if (end !== -1) {
        const toReplace = txt.substring(start, end);
        txt = txt.replace(toReplace, "");
        fs.writeFileSync(file, txt);
        console.log("Successfully removed contents.");
    } else {
        console.log("End marker not found.");
    }
} else {
    console.log("Start marker not found.");
}
