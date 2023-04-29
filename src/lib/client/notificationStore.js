import { writable } from "svelte/store";

// Notification Store - gestisce la notifica che appare nella navbar, basta importarlo e chiamare showNotification con il messaggio e il tipo per far apparire la notifica
// Migliorie: parametrizzare la durata, opzione per  mettere x per chiudere
const createNotificationStore= () => {
	const { subscribe, set } = writable({
		message: "",
        type: "",
        open: false
	});

    const showNotification = (message, type) => {
        set({message, type, open: true})
        setTimeout(function(){set({message: "", type: "", open: false})}, 7000);
    }

	return {
		subscribe,
        showNotification
	};
}

export const notificationStore = createNotificationStore()