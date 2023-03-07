import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from 'firebase-admin';
import { FBADMINCLIENTID, FBADMINPRIVATEKEYID, FBADMINPRIVATEKEY } from "$env/static/private"

const adminConfig = {
    "type": "service_account",
    "project_id": "gestionalemenumal",
    "private_key_id": FBADMINPRIVATEKEYID,
    "private_key": FBADMINPRIVATEKEY,
    "client_email": "firebase-adminsdk-tmqsd@gestionalemenumal.iam.gserviceaccount.com",
    "client_id": FBADMINCLIENTID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tmqsd%40gestionalemenumal.iam.gserviceaccount.com"
  }
  

export const getAdmin = () => {
    let app
    if (getApps().length) 
      app = getApp()
    else {
        app = initializeApp({
            credential: cert(adminConfig)
        });
    }
    const auth = getAuth(app);
    return { app, auth }
}

// non utilizzata, createsessioncookie controlla gia la validita del token
export const verifyToken = (token) => {
    getAdmin()
    return admin.auth().verifyIdToken(token)
}

export const verifySessionCookie = (session) => {
    getAdmin()
    return admin.auth().verifySessionCookie(session)
}

export  const createSessionCookie = async (token, maxAge) => {
    getAdmin()
    const expiresIn = maxAge * 1000 // nel browser la scadenza va settato in secondi
    // in firebase lo vuole in millisecondi, faccio conversione
    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn })
    return sessionCookie
}

export const revokeSessionCookie = async (session) => {
    getAdmin()
    admin.auth().verifySessionCookie(session)
    .then((decodedClaims) => {
        admin.auth().revokeRefreshTokens(decodedClaims.sub)
    }).catch((error) => {
        console.log(error)
    });
}