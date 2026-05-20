const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchString = 'adminSubTab === "school" && (';
const start = code.indexOf(searchString);

let count = 0;
let endIndex = -1;
for(let i = start + searchString.length - 1; i < code.length; i++) {
    if (code[i] === '(') count++;
    else if (code[i] === ')') count--;
    
    if (count === 0) {
        endIndex = i;
        break;
    }
}

const originalBlock = code.substring(start, endIndex + 1);

const newBlock = `adminSubTab === "school" && (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between pb-4 border-b theme-border-soft mb-4">
      <h3 className="font-black text-white uppercase tracking-widest text-lg font-afarin1">
         {interfaceLang === "Sorani" ? "بەڕێوەبردنی وانەکان" : "Rêveberiya Dersan"}
      </h3>
    </div>

    <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
      {[
        { id: "book", icon: Book, label: interfaceLang === "Sorani" ? "کتێب" : "Pirtûk" },
        { id: "author", icon: UserIcon, label: interfaceLang === "Sorani" ? "نووسەر" : "Nivîskar" },
        { id: "category", icon: Globe, label: interfaceLang === "Sorani" ? "زمان / شێوەزار" : "Ziman / Şêwezar" },
      ].map((group) => (
        <button
          key={group.id}
          onClick={() => {
             setSchoolGrouping(group.id as any);
             setSelectedSchoolCategory(null);
             playSound(clickAudio);
          }}
          className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all \${
             schoolGrouping === group.id
               ? "bg-white text-black shadow-lg"
               : "text-white/40 hover:text-white hover:bg-white/5"
           }\`}
        >
          <group.icon size={14} />
          {group.label}
        </button>
      ))}
    </div>

    {!selectedSchoolCategory ? (
       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
             const items = Array.from(new Set(allSchoolTopics.map((t) => {
                if (schoolGrouping === "book") return t.book;
                if (schoolGrouping === "author") return t.author;
                return t.category || t.dialect;
             }).filter(v => typeof v === "string" && v.trim() !== ""))).sort();

             return items.map((item: any, i) => (
                <button
                   key={i}
                   onClick={() => {
                      setSelectedSchoolCategory(item);
                      playSound(clickAudio);
                   }}
                   className="bg-white/5 hover:bg-white/10 border hover:theme-border-primary border-white/10 rounded-3xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[100px]"
                >
                   <span className="text-sm font-black text-white font-afarin1 uppercase tracking-wider">{item}</span>
                </button>
             ));
          })()}
       </div>
    ) : (
       <div className="space-y-4">
           <div className="flex items-center justify-between pb-4 border-b theme-border-soft">
              <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedSchoolCategory(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl">
                    <ArrowLeft size={16} className="rtl:rotate-180" />
                 </button>
                 <h3 className="font-black text-white uppercase tracking-widest text-lg font-afarin1">
                    {selectedSchoolCategory}
                 </h3>
              </div>
              <button
                 onClick={async () => {
                    const dialectKey = "گشتی"; 
                    const newTopic = { 
                       title: "New Topic " + Date.now().toString().slice(-4), 
                       content: "", 
                       book: schoolGrouping === 'book' ? selectedSchoolCategory : "", 
                       author: schoolGrouping === 'author' ? selectedSchoolCategory : "", 
                       category: schoolGrouping === 'category' ? selectedSchoolCategory : "",
                       dialect: dialectKey 
                    };
                    const current = appConfig?.dialectSchoolContent?.[dialectKey] || [];
                    try {
                       await setDoc(doc(db, "app", "global", "dialects", dialectKey), { topics: cleanObject([...current, newTopic]) }, { merge: true });
                       playSound(clickAudio);
                    } catch (e) {
                       console.error(e);
                    }
                 }}
                 className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase"
              >
                  <Plus size={14} />
                  {interfaceLang === "Sorani" ? "زیادکردنی بابەت" : "Mijarek nû zêde bike"}
              </button>
           </div>

           <div className="space-y-4">
              {(() => {
                 const topics = allSchoolTopics.filter(t => {
                    if (schoolGrouping === "book") return t.book === selectedSchoolCategory;
                    if (schoolGrouping === "author") return t.author === selectedSchoolCategory;
                    return (t.category || t.dialect) === selectedSchoolCategory;
                 });

                 return topics.map((topic, _idx) => {
                    const dialectKey = topic.dialect || "گشتی";
                    const handleSyncField = async (field: string, val: string) => {
                         const rawList = appConfig?.dialectSchoolContent?.[dialectKey] || [];
                         const globalIdx = rawList.findIndex((rt: any) => rt.title === topic.title);
                         if(globalIdx === -1) return;
                         
                         const list = [...rawList];
                         list[globalIdx][field] = val;
                         try {
                             await setDoc(doc(db, "app", "global", "dialects", dialectKey), { topics: cleanObject(list) }, { merge: true });
                         } catch (err) {
                             console.error("Sync error:", err);
                         }
                    };

                    const handleDelete = async () => {
                         if (!confirm(interfaceLang === "Sorani" ? "ئایە دڵنیای لە سڕینەوە؟" : "Ma tu bawer î ku tu dixwazî jê bibî?")) return;
                         
                         const rawList = appConfig?.dialectSchoolContent?.[dialectKey] || [];
                         const globalIdx = rawList.findIndex((rt: any) => rt.title === topic.title);
                         if(globalIdx === -1) return;
                         
                         const list = rawList.filter((_: any, i: number) => i !== globalIdx);
                         try {
                             await setDoc(doc(db, "app", "global", "dialects", dialectKey), { topics: cleanObject(list) }, { merge: true });
                             playSound(clickAudio);
                         } catch (err) {
                             console.error("Delete error:", err);
                         }
                    };

                    return (
                       <div key={_idx} className="bg-white/5 rounded-3xl border theme-border-soft p-5">
                          <div className="flex items-center justify-between mb-4">
                             <SyncInput
                                value={topic.title}
                                onSync={(val) => handleSyncField('title', val)}
                                className="bg-transparent text-white font-black text-xl outline-none focus:theme-border-primary border-b border-transparent w-full font-afarin1"
                                placeholder="Topic Title"
                             />
                             <div className="flex gap-2 ml-4">
                               <button
                                 onClick={handleDelete}
                                 className="p-2 flex-shrink-0 bg-rose-500/10 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                               >
                                 <Trash2 size={14} />
                               </button>
                             </div>
                          </div>
                          
                          <SyncTextarea
                             value={topic.content}
                             onSync={(val) => handleSyncField('content', val)}
                             className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 min-h-[150px] text-xs text-white/70 outline-none"
                             placeholder="Content (HTML/Markdown)"
                          />

                          <div className="mt-4 grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Category (Ziman/Şêwezar)</span>
                                <SyncInput
                                   value={topic.category || topic.dialect || ""}
                                   onSync={(val) => handleSyncField('category', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Author (Nivîskar)</span>
                                <SyncInput
                                   value={topic.author || ""}
                                   onSync={(val) => handleSyncField('author', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Book (Pirtûk)</span>
                                <SyncInput
                                   value={topic.book || ""}
                                   onSync={(val) => handleSyncField('book', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Image URL</span>
                                <SyncInput
                                   value={topic.image || ""}
                                   onSync={(val) => handleSyncField('image', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Video URL</span>
                                <SyncInput
                                   value={topic.video || ""}
                                   onSync={(val) => handleSyncField('video', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                             <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 ml-2">Audio URL</span>
                                <SyncInput
                                   value={topic.audio || ""}
                                   onSync={(val) => handleSyncField('audio', val)}
                                   className="w-full bg-black/20 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white outline-none"
                                />
                             </div>
                           </div>
                       </div>
                    )
                 });
              })()}
           </div>
       </div>
    )}
  </motion.div>
)`;

code = code.replace(originalBlock, newBlock);
fs.writeFileSync('src/App.tsx', code);
console.log('Successfully replaced admin school tab.');
