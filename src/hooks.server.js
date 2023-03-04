//import { verifyToken } from '$lib/server/adminFirebase.js';
import { verifySessionCookie } from '$lib/server/adminFirebase.js';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from "$lib/constants.js"

const unProtectedRoutes= [
    '/login'
];


// funzione chiamata ad ogni interazione con il server, per controllare se l'utente è loggato e autenticato
export async function handle({ event, resolve }) {
    const session = event.cookies.get(SESSION_COOKIE_NAME);
    // proteggere admin routes e se non sono loggato
    if (!session && !unProtectedRoutes.includes(event.url.pathname))
            throw redirect(303 ,'/login');
    
    // verifico la sessione
    if (session) {
        verifySessionCookie(session).then(async (decodedClaims) => {
            console.log("session cookie verified!")
            event.locals.user = JSON.stringify(decodedClaims.user_id)
        })
        .catch(() => {
            console.log("🐽🐽🐽🐽🐽")
            // se il token non è valido annullo i cookies
            event.cookies.delete(SESSION_COOKIE_NAME)
        });
    } 
    const response = await resolve(event)
    return response;
  }

  