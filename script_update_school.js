import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf8");

const groupsSearch = `{[
                        { id: "book", icon: Book, label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk" },
                        { id: "author", icon: UserIcon, label: interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar" },
                        { id: "category", icon: Globe, label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar" },
                      ].map((group) => (`;
const groupsReplace = `{[
                        { id: "book", icon: Book, label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk" },
                        { id: "author", icon: UserIcon, label: interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar" },
                        { id: "format", icon: Layers, label: interfaceLang === "Sorani" ? "جۆری بابەت" : "Cureyê Babetê" },
                        { id: "category", icon: Globe, label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar" },
                      ].map((group) => (`;

code = code.replace(groupsSearch, groupsReplace);

const groupsSearch2 = `{[
        { id: "book", icon: Book, label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk" },
        { id: "author", icon: UserIcon, label: interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar" },
        { id: "category", icon: Globe, label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar" },
      ].map((group) => (`;
const groupsReplace2 = `{[
        { id: "book", icon: Book, label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk" },
        { id: "author", icon: UserIcon, label: interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar" },
        { id: "format", icon: Layers, label: interfaceLang === "Sorani" ? "جۆری بابەت" : "Cureyê Babetê" },
        { id: "category", icon: Globe, label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar" },
      ].map((group) => (`;
code = code.replace(groupsSearch2, groupsReplace2);

const mapSearch1 = `if (schoolGrouping === "book") return t.book;
                                  if (schoolGrouping === "author") return t.author;
                                  return t.category;`;
const mapReplace1 = `if (schoolGrouping === "book") return t.book;
                                  if (schoolGrouping === "author") return t.author;
                                  if (schoolGrouping === "format") return t.format;
                                  return t.category;`;
code = code.replaceAll(mapSearch1, mapReplace1);

const mapSearch2 = `if (schoolGrouping === "book") return t.book === selectedSchoolCategory;
                                if (schoolGrouping === "author") return t.author === selectedSchoolCategory;
                                return (t.category) === selectedSchoolCategory;`;
const mapReplace2 = `if (schoolGrouping === "book") return t.book === selectedSchoolCategory;
                                if (schoolGrouping === "author") return t.author === selectedSchoolCategory;
                                if (schoolGrouping === "format") return t.format === selectedSchoolCategory;
                                return (t.category) === selectedSchoolCategory;`;
code = code.replaceAll(mapSearch2, mapReplace2);

const mapSearch3 = `if (schoolGrouping === "book") return t.book === item;
                                  if (schoolGrouping === "author") return t.author === item;
                                  return (t.category) === item;`;
const mapReplace3 = `if (schoolGrouping === "book") return t.book === item;
                                  if (schoolGrouping === "author") return t.author === item;
                                  if (schoolGrouping === "format") return t.format === item;
                                  return (t.category) === item;`;
code = code.replaceAll(mapSearch3, mapReplace3);

// The icon grouping in UI client:
const iconSearch = `{schoolGrouping === "book" ? (
                                        <Book
                                          size={24}
                                          className="text-white/40 group-hover:text-white"
                                        />
                                      ) : schoolGrouping === "author" ? (
                                        <UserIcon
                                          size={24}
                                          className="text-white/40 group-hover:text-white"
                                        />
                                      ) : (`;
const iconReplace = `{schoolGrouping === "book" ? (
                                        <Book
                                          size={24}
                                          className="text-white/40 group-hover:text-white"
                                        />
                                      ) : schoolGrouping === "author" ? (
                                        <UserIcon
                                          size={24}
                                          className="text-white/40 group-hover:text-white"
                                        />
                                      ) : schoolGrouping === "format" ? (
                                        <Layers
                                          size={24}
                                          className="text-white/40 group-hover:text-white"
                                        />
                                      ) : (`;
code = code.replaceAll(iconSearch, iconReplace);

// Admin mapping 1
const adminMap1 = `if (schoolGrouping === "book") return t.book;
                if (schoolGrouping === "author") return t.author;
                return t.category || t.dialect;`;
const adminMap1Rep = `if (schoolGrouping === "book") return t.book;
                if (schoolGrouping === "author") return t.author;
                if (schoolGrouping === "format") return t.format;
                return t.category || t.dialect;`;
code = code.replaceAll(adminMap1, adminMap1Rep);

// Admin mapping 2
const adminMap2 = `if (schoolGrouping === "book") return t.book === selectedSchoolCategory;
                    if (schoolGrouping === "author") return t.author === selectedSchoolCategory;
                    return (t.category || t.dialect) === selectedSchoolCategory;`;
const adminMap2Rep = `if (schoolGrouping === "book") return t.book === selectedSchoolCategory;
                    if (schoolGrouping === "author") return t.author === selectedSchoolCategory;
                    if (schoolGrouping === "format") return t.format === selectedSchoolCategory;
                    return (t.category || t.dialect) === selectedSchoolCategory;`;
code = code.replaceAll(adminMap2, adminMap2Rep);

// New topic object
const adminNew = `book: schoolGrouping === 'book' ? selectedSchoolCategory : "", 
                       author: schoolGrouping === 'author' ? selectedSchoolCategory : "", 
                       category: schoolGrouping === 'category' ? selectedSchoolCategory : "",`;
const adminNewRep = `book: schoolGrouping === 'book' ? selectedSchoolCategory : "", 
                       author: schoolGrouping === 'author' ? selectedSchoolCategory : "", 
                       format: schoolGrouping === 'format' ? selectedSchoolCategory : "",
                       category: schoolGrouping === 'category' ? selectedSchoolCategory : "",`;
code = code.replaceAll(adminNew, adminNewRep);

// Add the sync input for 'format'
const adminInputsSearch = `<div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Category (Ziman/Şêwezar)</span>`;
const adminInputsReplace = `<div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Type/Format (جۆری بابەت)</span>
                                <SyncInput
                                   value={topic.format || ""}
                                   onSync={(val) => handleSyncField('format', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Category (Ziman/Şêwezar)</span>`;
code = code.replaceAll(adminInputsSearch, adminInputsReplace);


fs.writeFileSync("src/App.tsx", code);
console.log("Replaced logic");
