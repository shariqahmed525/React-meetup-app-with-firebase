import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCdvcXA-ltMGblcYg5I9EpsdO7j6BQzcN4",
    authDomain: "mr-react.firebaseapp.com",
    databaseURL: "https://mr-react.firebaseio.com",
    projectId: "mr-react",
    storageBucket: "mr-react.appspot.com",
    messagingSenderId: "242001313795"
};
firebase.initializeApp(config);

export default firebase;