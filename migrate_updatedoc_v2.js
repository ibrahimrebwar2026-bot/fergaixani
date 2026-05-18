import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Flexible regex for the rename block (handles varying whitespace)
// Pattern looks for: await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', trimmed), cleanObject(current[activeAdminDialect]),
// followed by new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField()
const renameRegex = /await updateDoc\(\s*doc\(db,\s*'app',\s*'global'\),\s*new FieldPath\('dialectSchoolContent',\s*trimmed\),\s*cleanObject\(current\[activeAdminDialect\]\),\s*new FieldPath\('dialectSchoolContent',\s*activeAdminDialect\),\s*deleteField\(\)\s*\);/g;

content = content.replace(renameRegex, 
`const oldRef = doc(db, 'app', 'global', 'dialects', activeAdminDialect);
                                        const newRef = doc(db, 'app', 'global', 'dialects', trimmed);
                                        await setDoc(newRef, { topics: cleanObject(current[activeAdminDialect]) }, { merge: true });
                                        await deleteDoc(oldRef);
                                        await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField());`);

// Flexible regex for standard list updates
const listUpdateRegex = /await updateDoc\(\s*doc\(db,\s*'app',\s*'global'\),\s*new FieldPath\('dialectSchoolContent',\s*activeAdminDialect\),\s*cleanObject\(([^)]+)\)\s*\);/g;

content = content.replace(listUpdateRegex, (match, p1) => {
    return `await setDoc(doc(db, 'app', 'global', 'dialects', activeAdminDialect), { topics: cleanObject(${p1}) }, { merge: true });`;
});

// Case for deleteField
const deleteRegex = /await updateDoc\(\s*doc\(db,\s*'app',\s*'global'\),\s*new FieldPath\('dialectSchoolContent',\s*activeAdminDialect\),\s*deleteField\(\)\s*\);/g;
content = content.replace(deleteRegex, 
`await deleteDoc(doc(db, 'app', 'global', 'dialects', activeAdminDialect));
                                        await updateDoc(doc(db, 'app', 'global'), new FieldPath('dialectSchoolContent', activeAdminDialect), deleteField());`);

// Case for line 3766: sanitizedKey
const sanitizedRegex = /await updateDoc\(\s*docRef,\s*new FieldPath\('dialectSchoolContent',\s*sanitizedKey\),\s*\[\]\s*\);/g;
content = content.replace(sanitizedRegex, `await setDoc(doc(db, 'app', 'global', 'dialects', sanitizedKey), { topics: [] }, { merge: true });`);

fs.writeFileSync('src/App.tsx', content);
console.log('Processed updateDoc calls with flexible regex');
