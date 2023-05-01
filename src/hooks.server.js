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
    
    // se ce la sessione, la verifico e poi faccio i redirect
    if (session) {
        // verifico la sessione
        verifySessionCookie(session).then(async (decodedClaims) => {
            event.locals.user = JSON.stringify(decodedClaims.user_id)
        })
        .catch(() => {
            console.log("🐽🐽🐽🐽🐽")
            // se il token non è valido annullo i cookies
            event.cookies.delete(SESSION_COOKIE_NAME)
        });
        
        // REDIRECT
        // se sono loggato non posso andare nella login
        if (event.url.pathname === "/login")
            throw redirect(303 ,'/');

    } 
    const response = await resolve(event)
    return response;
  }

  