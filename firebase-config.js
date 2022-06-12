import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';


const config = {
    apiKey: "AIzaSyDNM6e0lq7bh5UUh9qxJ_CTF9hZVfIoIkA",
    authDomain: "zakaria-ben-jaoued.firebaseapp.com",
    projectId: "zakaria-ben-jaoued",
    storageBucket: "gs://zakaria-ben-jaoued.appspot.com",
    messagingSenderId: "42915064040",
    appId: "1:42915064040:web:1854d9c3c4c41be6c0415d",
    measurementId: "G-JQTQVZCZ8X"
}
const app =  initializeApp(config)


const appStorage = getStorage(app)

export { app, appStorage }