//import app from "firebase/app";
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firebase-firestore';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
    constructor() {
        console.log('Firebase constructor is called.');
        this.app = app.initializeApp(config);
        this.auth = this.app.auth();
        this.db = this.app.firestore();
        this.functions = this.app.functions('europe-west1');
        this.storage = this.app.storage('gs://academyapp-e3edd.appspot.com/');
        console.log(`Logged in in the beginning ${this.auth.currentUser != null}.`);
        this.auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log(`User ${user.email} logged in.`);
                localStorage.setItem('loggedIn', 'true');
            } else {
                this.auth.setStatePersistence('local');
                this.auth.signInAnonymously().then(() => {
                    console.log('Logged in anon.');
                    localStorage.setItem('loggedIn', 'false');
                });
            }
        });
    }

    //#region auth APi

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = (password) =>
        this.auth.currentUser.updatePassword(password);

    setStatePersistence = (persistence) => this.auth.setPersistence(persistence);

    getUid = () => this.auth.currentUser.uid;

    getUserMail = () => this.auth.currentUser.email;
    //#endregion

    //#region Firestore API
    getCollection = (collection) => this.db.collection(collection).get();

    orderCollection = (collection, orderElement, orderBy) =>
        this.db.collection(collection).orderBy(orderElement, orderBy).get();

    orderAndLimitCollection = (collection, orderElement, orderBy, limit) =>
        this.db
            .collection(collection)
            .orderBy(orderElement, orderBy)
            .limit(limit)
            .get();

    queryAndOrderAndLimitCollection = (
        collection,
        orderElement,
        orderBy,
        limit,
        firstQueryElement,
        queryOperator,
        secondQueryElement,
    ) =>
        this.db
            .collection(collection)
            .where(firstQueryElement, queryOperator, secondQueryElement)
            .orderBy(orderElement, orderBy)
            .limit(limit)
            .get();
    getDocument = (collection, document) =>
        this.db.collection(collection).doc(document).get();

    updateDocument = (collection, document, data) =>
        this.db.collection(collection).doc(document).update(data);

    uploadDocument = (collection, data) =>
        this.db.collection(collection).add(data);
    //#endregion

    //#region Functions API
    callFunction = (functionName) => this.functions.httpsCallable(functionName);
    //#endregion

    //#region Storage API
    getDownLoadUrl = (filepath) =>
        this.storage.ref('votingImages').child(filepath).getDownloadURL();

    uploadImage = (filepath, image, metadata) =>
        this.storage.ref('votingImages').child(filepath).put(image, metadata);
    //#endregion
}

export default Firebase;
