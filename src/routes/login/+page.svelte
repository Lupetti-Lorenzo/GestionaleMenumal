<svelte:head>
    <title>Login</title>
</svelte:head>

 
<script>
    import { deserialize } from "$app/forms";
    import { goto } from "$app/navigation"
    import { getFirebase } from "$lib/client/firebase"
    import { signInWithEmailAndPassword, inMemoryPersistence } from "firebase/auth"
    import { invalidateAll } from "$app/navigation"
    import { notificationStore } from "$lib/client/notificationStore"

    const { auth } = getFirebase()

    let email, password
    // messaggi di errore
    $: err = "";

    async function login() { 
        // login con email e password
        auth.setPersistence(inMemoryPersistence).then(() => { //inMemoryPersistence per non far salvare cookies a firebase
            signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredentials) => {
            //  login successfull
            //  prendo id token dell'utente
            const token = await userCredentials.user.getIdToken();
            const uid = userCredentials.user.uid
            // creo un form con id token, da mandare all'azione default nel page.server.js
            const formData = new FormData();
            formData.set('token', token);
            formData.set('uid', uid)
            
            // mando il messaggio, l'azione crea il session token e setta i cookies
            const res = await fetch(this.action, {
                method: 'POST',
                body: formData
            });
            //console.log(JSON.stringify(res))
            //se sono loggato con successo vado alla dashboard
            const result = deserialize(await res.text());  
            if (result.data.success) { //login successfull
                await invalidateAll() // per richiamare la load, cosí aggiorna user.locals e lo store authUser
                goto("/")
                notificationStore.showNotification("Login effettuato con successo!", "success")
            } // altrimenti mando errore
            else throw new Error(result.data.message); 
          })
          .catch((error) => { // qui prendo l'errore, setto il messaggio nel loginform
            err = error.message;
            if (error.message.includes("user-not-found"))
                err = "Errore: email non registrata";
            else if (error.message.includes("password"))
                err = "Errore: password errata";
        });
        })
    }
</script>


  <section>
    <div class="mt-20 flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="https://www.menumal.it/info.html" class="flex items-center mb-6 text-2xl font-semibold text-gray-900">
            <!-- <img class="w-8 h-8 mr-2" src="" alt="logo"> -->
            Menumal    
        </a>
        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Entra nel tuo account
                </h1>
                <form class="space-y-4 md:space-y-6" method="POST" on:submit|preventDefault="{login}">
                    <div>
                      <label for="emailInput" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                      <input bind:value={email}
                        type="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        id="emailInput"
                        aria-describedby="emailHelp"
                        placeholder="Email Address"
                      />
                    </div>
                    <div>
                      <label for="passInput" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input bind:value={password}
                        type="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required
                        id="passInput"
                        placeholder="Password"
                      />
                    </div>
                    <button type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Login</button> 
                    {#if err !== ""}
                      <p style="color: red">{err}</p>
                    {/if}
                </form>
            </div>
        </div>
    </div>
  </section>