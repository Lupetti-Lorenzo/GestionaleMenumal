import { mongoose } from "mongoose"
import { MONGO_URL } from "$env/static/private"
import { UserModel } from "$lib/server/db/models/User.js"

export const dbConnect = async () => {
    // let client
    // if (!mongoose.connection)
    //     client = await mongoose.connect(MONGO_URL, () => {
    //         console.log("Connesso a mongo")
    //     });
    // else {
    //     client = mongoose.connection
    //     console.log("Ero gia connesso, prendo quella gia esistente");
    // }
    mongoose.set('strictQuery', false)
    const client = await mongoose.connect(MONGO_URL)
    //console.log("connected to db")
    return { client }
};

export const dbDisconnect = async () => {
    await mongoose.disconnect();
    console.log('disconnesso da db');
};

export const getUser = async (id) => {
    let dbRes = await UserModel.find({uidFireBase: JSON.parse(id)})
    let userDB = JSON.parse(JSON.stringify(dbRes))[0]
    return userDB
}