const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    sku: {
        type: String,
        unique: true
    },
    descripcion: String,
    cantidad: Number,
    fecha_ingreso: {
        type: Date,
        default: new Date()
    }
});

module.exports = model('product', productSchema);  