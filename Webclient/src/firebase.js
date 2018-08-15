import firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyBUM0buh2ifPF7UyZ_J5SYrDV2jLemnOoM",
  authDomain: "net-stccg.firebaseapp.com",
  databaseURL: "https://net-stccg.firebaseio.com",
  projectId: "net-stccg",
  storageBucket: "net-stccg.appspot.com",
  messagingSenderId: "999541354921"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
