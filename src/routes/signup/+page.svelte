<svelte:head>
    <title>Sing Up</title>
</svelte:head>
<script>
    import { deserialize } from "$app/forms";
    import { goto } from "$app/navigation"
    import { getFirebase } from "$lib/client/firebase"
    import { signOut, createUserWithEmailAndPassword, inMemoryPersistence } from "firebase/auth"
    import { invalidateAll } from "$app/navigation"
    

    const { auth } = getFirebase()

    let email, password // bind ai valori dei campi
    // messaggi di errore
    $: err = "";
    $: res = ""

    async function singup() { 
        // creo user con email e password.
        auth.setPersistence(inMemoryPersistence).then(() => {
            createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredentials) => {
            //  creato - non faccio login automatico, in fodo faccio redirect alla login
            // creo lo user nel database - setto i campi del db e chiamo l'azione nel server
            const formData = new FormData();
            formData.set('email', userCredentials.user.email);
            formData.set('uidFireBase', userCredentials.user.uid);
            
            // mando il messaggio, l'azione crea l'utente nel database
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });

            const result = deserialize(await response.text());
            if (result.data.success) { //register successful
                signOut(auth)
                res = "Utente creato con successo!"
                await invalidateAll()
            } // altrimenti mando errore
            else { // questo punto se il db ha fallito, ho comunque creato un utente su fb
              // fare api route per eliminare l'utente
              // fetch("/eliminaUser") OPPURE POTREI FARE GIA TUTTO IN SINGUP
              throw new Error(result.data.message);
            }
          })
          .catch((error) => {
            err = error;
            //eliminare utente fb
        });
        })
    }
</script>


<div class="login">
    <div class="card">
      <div class="card-body login-form">
        <h5 class="card-title">Sign Up</h5>
        <form method="POST" on:submit|preventDefault="{singup}">
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
        {#if res !== ""}
          <p style="color: green">{res}</p>
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