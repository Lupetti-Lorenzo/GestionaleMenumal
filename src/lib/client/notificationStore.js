import { writable } from "svelte/store";

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