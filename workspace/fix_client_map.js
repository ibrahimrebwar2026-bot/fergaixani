const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{[
                        {
                          id: "book",
                          icon: Book,
                          label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk",
                        },
                        {
                          id: "author",
                          icon: UserIcon,
                          label:
                            interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar",
                        },
                        {
                          id: "category", 
                          icon: Globe, 
                          label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar",
                        },
                      ].map((group) => (`

const replace = `{[
                        {
                          id: "book",
                          icon: Book,
                          label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk",
                        },
                        {
                          id: "author",
                          icon: UserIcon,
                          label:
                            interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar",
                        },
                        {
                          id: "format",
                          icon: Layers,
                          label: interfaceLang === "Sorani" ? "جۆری بابەت" : "Cureyê Babetê",
                        },
                        {
                          id: "category", 
                          icon: Globe, 
                          label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar",
                        },
                      ].map((group) => (`

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Fixed map");
} else {
  console.log("Not found");
}
