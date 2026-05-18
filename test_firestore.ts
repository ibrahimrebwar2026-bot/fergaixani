import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, FieldPath, updateDoc, deleteField } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import * as dotenv from 'dotenv';
dotenv.config();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const testIndexOf = async () => {
    try {
        // Try bad values for options?
        await setDoc(doc(db, 'app', 'global', 'overrides', "1000"), { exercises: [ { options: [1, 2] } ] }, { merge: true });
    } catch (e: any) {
        console.error("Test 1:", e.message);
    }
    
    try {
        await setDoc(doc(db, 'app', 'global', 'overrides', "1000"), { exercises: { [new FieldPath("foo") as any]: "bar"} }, { merge: true });
    } catch (e: any) {
        console.error("Test 2:", e.message);
    }

    try {
        const x: any = {};
        x[deleteField() as any] = "bar";
        await setDoc(doc(db, 'app', 'global', 'overrides', "1000"), { exercises: x }, { merge: true });
    } catch (e: any) {
        console.error("Test 3:", e.message);
    }

    try {
        // Test custom cleanObject
        const cleanObject = (obj: any): any => {
            if (Array.isArray(obj)) {
                return obj.map(v => cleanObject(v)).filter(v => v !== undefined && typeof v !== 'function');
            } else if (obj !== null && typeof obj === 'object') {
                if (obj.constructor && obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
                    return obj;
                }
                return Object.fromEntries(
                    Object.entries(obj).map(([k, v]) => [k, cleanObject(v)]).filter(([_, v]) => v !== undefined && typeof v !== 'function')
                );
            }
            if (typeof obj === 'function') return undefined;
            return obj;
        };

        const weirdObj = new Error("foo");
        await setDoc(doc(db, 'app', 'global', 'overrides', "1000"), { exercises: cleanObject(weirdObj) }, { merge: true });
    } catch (e: any) {
         console.error("Test 4 Error:", e.message);
    }
}
testIndexOf();
