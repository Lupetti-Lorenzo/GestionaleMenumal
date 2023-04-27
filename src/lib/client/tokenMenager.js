// import { authUser } from "./auth"
// import { get } from 'svelte/store'


// export let token = readable(null, async (set) => {
//   console.log('get the token')
  
// })

// import { writable } from "svelte/store"; 

// function createTokenMenager() {
// 	const { subscribe, update} = writable("")

//     const getToken = () => {
//         update(old => {
//             if (old == null) // oppure è expired
//     {
//         const formData = new FormData();
//         formData.set('uid', get(authUser).id)
//         const res = await fetch("api/creaTokenMenumal", {
//             method: 'POST',
//             body: formData
//         });
//         const token = await res.json()
//         set(token)
//     }

//         })
//     }

// 	return {
// 		subscribe,
// 		getToken,
// 	};
// }

// export const tokenMenager = createTokenMenager()