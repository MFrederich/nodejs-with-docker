'use strict';

const Joi= require('@hapi/joi')
const Product = require('./models/product')


module.exports = {
    name: 'route',
    register: async (server) => {
        server.route([
        {
            method: 'GET',
            path: '/',
            handler: async (request, h) => {
                try {
                    return {title: 'jelou'};
                } catch (error) {
                    console.log(error);
                    return error;
                }

            }
        },
        {
            method: '*',
            path: '/{any*}',
            handler: function (request, h) {

                return h.response().code(404)
            }
        },    
        {
            method: 'GET',
            path: '/abarrotes',
            handler: async (request, h) => {
                try {
                    const products = await Product.find();
                    return h.response(products);
                } catch (error) {
                    console.log(error);
                }

            }
        },    
        {
            method: 'GET',
            path: '/abarrotes/{id}',
            handler: async (request, h) => {
                try {
                    const products = await Product.find({sku:request.params.id});
                    return h.response(products);
                } catch (error) {
                    console.log(error);
                }

            }
        },
        {
            method: 'DELETE',
            path: '/abarrotes/{id}',
            handler: async (request, h) => {
                try {
                    const products = await Product.findOneAndDelete({sku:request.params.id});
                    return h.response(products);
                } catch (error) {
                    console.log(error);
                }

            }
        }, {
            method: 'POST',
            path: '/abarrotes',
            options:{
                validate:{
                    payload: Joi.object({
                        sku:Joi.string().required(),
                        descripcion:Joi.string().required(),
                        cantidad:Joi.number().required(),
                    }),
                    failAction: (request, h , error) =>{
                        console.log(error);

                        return error.isJoi 
                        ? h.response(error.details[0]).takeover()
                        : h.response(error).takeover();
                    }
                
                }
            } ,
            handler: async (request, h) => {
                try {
                    const product = new Product(request.payload);
                    const saved = await product.save();
                    return h.response(saved);
                } catch (error) {
                    console.log(error);
                }

            }
        }
        ]);
    }
}