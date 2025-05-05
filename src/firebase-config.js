//Firebase Initialization

/* The core Firebase JS SDK is always required and must be listed first
    <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>

    TODO: Add SDKs for Firebase products that you want to use
https://firebase.google.com/docs/web/setup#available-libraries 
<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script> */

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyASvU010lEBlIWT3lq-hcmCOKwnarsBbTc",
    authDomain: "react-map-project-95e99.firebaseapp.com",
    databaseURL: "https://react-map-project-95e99.firebaseio.com",
    projectId: "react-map-project-95e99",
    storageBucket: "react-map-project-95e99.appspot.com",
    messagingSenderId: "61618595535",
    appId: "1:61618595535:web:29a6547d7a21beda3779ba",
    measurementId: "G-DEGGCBK3YG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var fb = firebase.firestore();

export default fb;
