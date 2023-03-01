import mongoose from 'mongoose';

const LocaleSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      //minLength: 10
      //lowercase: true
    },
    idSQL: {  
        type: String,
      },
    urlFoto: {
      type: String,
    },
    stato: {
        type: String,
      },
      statoAbbonamento: {
        type: String,
      },
      scadenza: {
        type: Date,
      },
      note: {
        type: String,
      },
      tipoAbbonamento: {
        type: String,
      },
      commissioneSales: {
        type: Number,
        min: 1,
        max: 100
      },
      prezzoAttivazione: {
        type: String,
      },
      venditori: [ // array di id dei venditori
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User"
        }
    ]
  },
  {
    timestamps: true,
  }
);

export const LocaleModel =
  mongoose.models.Locale ?? mongoose.model('Locale', LocaleSchema);