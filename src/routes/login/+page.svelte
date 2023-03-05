<svelte:head>
    <title>Login</title>
</svelte:head>


<script>
    import { deserialize } from "$app/forms";
    import { goto } from "$app/navigation"
    import { getFirebase } from "$lib/client/firebase"
    import { signOut, signInWithEmailAndPassword, inMemoryPersistence } from "firebase/auth"
    import { invalidateAll } from "$app/navigation"

    const { auth } = getFirebase()

    let email, password // bind ai valori dei campi
    // messaggi di errore
    $: err = "";

    async function login() { 
        //console.log("Premuto login")
        // login con email e password
        auth.setPersistence(inMemoryPersistence).then(() => {
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
            
            // mando il messaggio, l'azione setta i cookies
            const res = await fetch(this.action, {
                method: 'POST',
                body: formData
            });

            // se sono loggato con successo vado alla dashboard
            const result = deserialize(await res.text());       

            if (result.data.success) { //login successfull
                await invalidateAll() // per richiamare la load, cosí aggiorna user.locals e lo store authUser
                goto("/");
            } // altrimenti mando errore
            else throw new Error(result.data.message);
          })
          .catch((error) => { // qui prendo l'errore, faccio logout e setto il messaggio nel loginform
            err = error;
            signOut(auth).then(() => {
                console.log("Error in login, loggin out")
            })
            .catch((err) => {
                err = error.message;
                console.err(err)
            })
        });
        })
    }
</script>


<div class="login">
    <div class="card">
      <div class="card-body login-form">
        <h5 class="card-title">Login</h5>
        <form method="POST" on:submit|preventDefault="{login}">
          <div class="mb-3">
            <label for="emailInput" class="form-label">Email address</label>
            <input bind:value={email}
              type="email"
              class="form-control"
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Email Address"
            />
          </div>
          <div class="mb-3">
            <label for="passInput" class="form-label">Password</label>
            <input bind:value={password}
              type="password"
              class="form-control"
              id="passInput"
              placeholder="Password"
            />
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        {#if err !== ""}
          <p style="color: red">{err}</p>
        {/if}
      </div>
    </div>
  </div>
  
  <style>
    .card {
      width: 50%;
      margin: 0 auto;
    }
    .login {
      margin-top: 50px;
      margin-bottom: 50px;
    }
    .login-form {
      width: 60%;
      margin: 0 auto;
    }
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      .login-form {
        width: 90%;
      }
      .card {
        width: 90%;
      }
    }
  </style>