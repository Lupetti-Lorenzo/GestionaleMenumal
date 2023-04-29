import { page } from '$app/stores';
import { derived } from 'svelte/store';

 export const authUser = derived(
    page,
    ($page, set) => {
        const user  = $page.data.user;
        if (!user) {
            set(null);
            return;
        }
        set(user);
    },
    null
);