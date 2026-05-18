import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the rename block
const renameTarget = `                                        await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', trimmed), cleanObject(current[activeAdminDialect]),
                                          new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField()
                                        );`;
const renameReplacement = `                                        const oldRef = doc(db, 'app', 'global', 'dialects', activeAdminDialect);
                                        const newRef = doc(db, 'app', 'global', 'dialects', trimmed);
                                        await setDoc(newRef, { topics: cleanObject(current[activeAdminDialect]) }, { merge: true });
                                        await deleteDoc(oldRef);
                                        // Cleanup global doc too just in case
                                        await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField());`;

content = content.replace(renameTarget, renameReplacement);

// 2. Replace the section delete block
const deleteTarget = `await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField());`;
const deleteReplacement = `await deleteDoc(doc(db, 'app', 'global', 'dialects', activeAdminDialect));
                                        await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField());`;

content = content.replace(deleteTarget, deleteReplacement);

// 3. Replace the standard list update blocks
// Pattern: await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), cleanObject(list));
// Note: recursive replace for all occurrences
const listUpdateRegex = /await updateDoc\(doc\(db, 'app', 'global'\), new FieldPath\('dialectSchoolContent', activeAdminDialect\), cleanObject\((list|\[\.\.\.current, newTopic\])\)\);/g;
content = content.replace(listUpdateRegex, (match, p1) => {
    return `await setDoc(doc(db, 'app', 'global', 'dialects', activeAdminDialect), { topics: cleanObject(${p1}) }, { merge: true });`;
});

// Any other variants?
// Line 5054 used [...current, newTopic]
// Line 5079 used list
// Line 5110 used list
// ...

// Check for any missed ones with FieldPath
// grep showed:
// 5231: await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), cleanObject(list));

fs.writeFileSync('src/App.tsx', content);
console.log('Processed updateDoc calls');
