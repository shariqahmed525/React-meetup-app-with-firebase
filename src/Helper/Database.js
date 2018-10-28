import firebase from '../Config/firebase';
const FIREBASE_DATABASE = firebase.database().ref('meetupapp/');
export default FIREBASE_DATABASE;