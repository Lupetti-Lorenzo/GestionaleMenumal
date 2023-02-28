import { mongoose } from "mongoose"
import { MONGO_URL } from "$env/static/private"

export const dbConnect = async () => {
    console.log('provo');
    let client
    if (!mongoose.connection)
        client = await mongoose.connect(MONGO_URL, () => {
            console.log("Connesso a mongo")
        });
    else {
        client = mongoose.connection
        console.log("Ero gia connesso, prendo quella gia esistente");
    }
    return { client }
};





  

export const dbDisconnect = async () => {
    await mongoose.disconnect();
    console.log('disconnesso da db');
};