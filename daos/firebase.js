import admin from 'firebase-admin'
import { firebaseData } from '../config.js'
import ContenedorFirebase from '../contenedores/firebase.js'

class Mensajes extends ContenedorFirebase {
    constructor(db) {
        super(db.collection('mensajes'))
    }
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseData),
  databaseURL: "https://basedeprueba-8e5c0.firebaseio.com"
});

const db = admin.firestore()

export const mensajes = new Mensajes(db)
