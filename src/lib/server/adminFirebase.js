import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import admin from 'firebase-admin';

const adminConfig = {
    "type": "service_account",
    "project_id": "gestionalemenumal",
    "private_key_id": "5f446192e8fbd486a350c91b678e39e4f0833209",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHOqD2bH/Pchw6\nBRnFABqQtVixW7jG3rnn3DNZmW/yKEmxfnZnZhRzWFZWEfD0RstKWEeVHVt1WZ/O\nAhxi/tdoJWZC3lvHVkziChndgdiC33SfHVwco7IM/+K3kVMzNCJyFOSVeD9ZpiDI\nKbx7cj7mqqpOQiFsaIS45dBicoCLqytwnTFhSyZ9M2fREI5kWveNiPUjYCPhM2mA\n1dYZMppZtG78W5xka8zhq8x7KnmLnp7lWj1vhAgMHg8xKhYF0lmqisucNpDzJzG8\nIY5lgTVTNR3cwXjELtC1NKHXzp4Vwx8ClWIQN7v8l/o6ogqSZC9LIskrl81tO5y8\nopW3hHcZAgMBAAECggEAFLKm+pb008/QdiglwFlViTNn7Jwhdxq4UGnodU5rKoqs\nNkoTwcQBi6axqIU6ZdxtfhKsFCYtxGQsZaYDPjco2JdrF3cbrJrPB7xCKei1nkoa\nBvZRRaHti2txqb3JuaP40KaSRWON3FHVrcnlPKN2vLbeFN2KtKUqpb1tb+7ioy/V\nCVixHvlqMDJjZ4kbdkiQ/rojszJg4KTnOKzHtGgUb28QADI5oR+92kuIB3uLMwJx\nvp/X3x3FMDrN2kGwI67FUCs5aEEKVOOC+MPhyifGupOtWSN6u2EdQ6auhdnjq+HS\nh1Vn7jECZhJYB6CBrCLbYfUVFyV4grb3Kba0uhDFUQKBgQD2/igYYmTfff9V2+4R\nzoKAjDisCHkAG3jH1F7DkyDS0+miGSkVHqBX8S/WE35ITJMnUlnhCJ+OQLdd3PVd\n22+LBxkIL7j5+t9EyoIaMdmVeGFJzWAiHje7FSJGqoGuIOKoNSVUG+oQ4e3BwE8T\nGWcm/NZNC0fiZZX7vpqhQ6v4EQKBgQDOfpCyYXqhAW2j7222tDcjlagodMkyzUfY\ngTYxyQcmP7/VS5oySPGgL8q096qDKfSe4IhfQtC0saaK8AyRMt0BWlXxEftB+EED\nNNPtLSSV6Rv+Z2W+Ehe3H5ZYzpTloBTBCV054Xy3ROrg2VFJdkof4ghfL1XlKrMs\nh+rm97dWiQKBgHxS2iPMAzJr3YZ+OYtFA3NpIW2WpjFjopwTTc/r0u3MNSGewIsc\n62DYyldbYIlL4hY84XjgOlAES0g33FnuBmtYm0T/oIBTwuaBeJNu3DLccTwQ4H7L\n7wmATcx8LuJTM0Ov3KZFlsAAuQh5oFPgyYdaZRRKxVg0AhbBjlv2EC3BAoGBAJSo\nf2k8TjlNOu6Td0vaL/v5SOdfNF3TdY7Dbw2maPQ7XtKiq+7ZnsIwxeFEj8f/03Dx\nupvCEViUsI5DxPhfQsYvj8GOrXFP1RYG2S9dmYInIRUkwRV2FwapweZLStyJQ4e5\nQxlhYRTbk7CuIxwdAb40Tsyf2lmyRO2hKBaBbcbpAoGAY49Kd9I/dkoY705RvT+d\nluSMdBi2BbjYRTECjTPDZQqJDAUbSFjuDJ9fjMPjrIjv59Ax6ahD2lcA4H+n4NgN\nabe/55WKkB8gjLWQQ1sd8R7RIP83jkXVRvcYndPIR4obTAHctqwdJ97eGdNzP6Td\nukMgyH8FHAcgKzV9YLcPOoc=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-tmqsd@gestionalemenumal.iam.gserviceaccount.com",
    "client_id": "112053687882919517262",
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