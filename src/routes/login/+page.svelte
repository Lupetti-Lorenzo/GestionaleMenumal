<script>
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { getFirebase } from '$lib/client/firebase';
	import { signInWithEmailAndPassword, inMemoryPersistence } from 'firebase/auth';
	import { invalidateAll } from '$app/navigation';
	import { notificationStore } from '$lib/client/notificationStore';

	const { auth } = getFirebase();

	let loading = false;

	let email, password;
	// messaggi di errore
	$: err = '';

	async function login() {
		loading = true;
		// login con email e password
		auth.setPersistence(inMemoryPersistence).then(() => {
			//inMemoryPersistence per non far salvare cookies a firebase
			signInWithEmailAndPassword(auth, email, password)
				.then(async (userCredentials) => {
					//  login successfull
					//  prendo id token dell'utente
					const token = await userCredentials.user.getIdToken();
					const uid = userCredentials.user.uid;
					// creo un form con id token, da mandare all'azione default nel page.server.js
					const formData = new FormData();
					formData.set('token', token);
					formData.set('uid', uid);

					// mando il messaggio, l'azione crea il session token e setta i cookies
					const res = await fetch(this.action, {
						method: 'POST',
						body: formData
					});

					//se sono loggato con successo vado alla dashboard
					const result = deserialize(await res.text());
					loading = false;
					if (result.data.success) {
						//login successfull
						await invalidateAll(); // per richiamare la load, cosí aggiorna user.locals e lo store authUser
						goto('/');
						notificationStore.showNotification('Login effettuato con successo!', 'success');
					} // altrimenti mando errore
					else throw new Error(result.data.message);
				})
				.catch((error) => {
					// qui prendo l'errore, setto il messaggio nel loginform
					loading = false;
					err = error.message;
					if (error.message.includes('user-not-found')) err = 'Errore: email non registrata';
					else if (error.message.includes('password')) err = 'Errore: password errata';
				});
		});
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section>
	<div class="mt-20 flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
		<a
			href="https://www.menumal.it/info.html"
			class="flex items-center mb-6 text-2xl font-semibold text-gray-900"
		>
			<!-- <img class="w-8 h-8 mr-2" src="" alt="logo"> -->
			Menumal
		</a>
		<div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
					Entra nel tuo account
				</h1>
				<form class="space-y-4 md:space-y-6" method="POST" on:submit|preventDefault={login}>
					<div>
            <!-- Email e password inputfields -->
						<label for="emailInput" class="block mb-2 text-sm font-medium text-gray-900"
							>Email</label
						>
						<input
							bind:value={email}
							type="email"
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							id="emailInput"
							aria-describedby="emailHelp"
							placeholder="Email Address"
						/>
					</div>
					<div>
						<label for="passInput" class="block mb-2 text-sm font-medium text-gray-900 "
							>Password</label
						>
						<input
							bind:value={password}
							type="password"
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							required
							id="passInput"
							placeholder="Password"
						/>
					</div>
					<!-- Bottone login, compare loader e si disabilita quando viene cliccato mentre viene eseguita la login -->
          <button
						type="submit"
						disabled={loading}
						class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
					>
						{#if !loading}
							Login
						{:else}
							<!-- Dopo aver cliccato completa faccio vedere un loader al posto della parola mentre esegue la richiesta-->
							<div role="status">
								<svg
									aria-hidden="true"
									class="inline w-5 h-5 text-gray-200 animate-spin fill-gray-600"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
								<span class="sr-only">Loading...</span>
							</div>
						{/if}
					</button>
          <!-- Errore che compare in fondo al form quando c'ene uno nella login -->
					{#if err !== ''}
						<p style="color: red">{err}</p>
					{/if}
				</form>
			</div>
		</div>
	</div>
</section>
