import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      //immutable: true
    },
    uidFireBase: String,
    admin: {
      type: Boolean,
    },
    userAPI: {
        type: String,
    },
    passAPI: {
        type: String,
    },
    locali: [ // array di id dei locali a cui ha venduto il menu
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Locale"
        }
    ]
  }
);


//virtual property, basata sul valore di altre 
UserSchema.virtual("credentialsAPI").get(function() {
    return `${this.userAPI}:${this.passAPI}`
})

export const UserModel =
  mongoose.models.User ?? mongoose.model('User', UserSchema);


  //metodo su ogni istanza, posso accedere this
// UserSchema.methods.hello = function() {
//     console.log(this.email)
// }

//metodo statico accedibile da tutte le istanze
// UserSchema.statics.findByEmail = function(email) {
//     return this.find({email: email})
// }

//chainable, posso userlo dopo .find() o .where() -  User.find().byEmail("lorelore@gmail.com")
// UserSchema.query.byEmail= function(email) {
//     return this.where({email: email})
// }

//middleware - pre o post, funzioni che runnano prima o dopo una certa interazione con il modello
// UserSchema.pre('save', function(next) {
//     this.updatedAt = Date.now()
//     se non chiamo next() non salva, e posso mandare un errore 
//     if() 
        //next()
    // else
    //     throw new Error("Non puoi salvare ....")
// })
//doc è lo user che ha appena fito la save, non posso accederlo con this - mi viene passato dal middelware
// UserSchema.post('save', function(doc, next) {
//     doc.hello()
//     next()
// })