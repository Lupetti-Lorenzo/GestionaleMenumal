import { authUser } from "./auth"
import { get } from 'svelte/store'
import { readable } from 'svelte/store';

async function getNewToken() {
    const formData = new FormData();
        formData.set('uid', get(authUser).id)
        const res = await fetch("api/creaTokenMenumal", {
            method: 'POST',
            body: formData
        });
        const token = await res.json()
        return token
}

// readable store che contiene il token di comunicazione con l'API di menumal, il token dura mezz'ora
// dopo averlo inizialmente settato, avvio un timer che ogni mezz'ora lo aggiorna con uno nuovo
export const token = readable("", async function start(set) {
    set(await getNewToken()) 
	const interval = setInterval(async () => {
		set(await getNewToken());
	}, 1790000); // ogni mezzora refresha il token

	return function stop() {
		clearInterval(interval);
	};
});
