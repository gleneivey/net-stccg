import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyBUM0buh2ifPF7UyZ_J5SYrDV2jLemnOoM",
  authDomain: "net-stccg.firebaseapp.com",
  databaseURL: "https://net-stccg.firebaseio.com",
  projectId: "net-stccg",
  storageBucket: "net-stccg.appspot.com",
  messagingSenderId: "999541354921"
};

firebase.initializeApp(config);

export default firebase;
