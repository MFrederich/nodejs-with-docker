'use strict';

require('dotenv').config()

const uuid = require('node-uuid');  
const mongojs = require('mongojs');

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi');

//To configure the connection, we are going to use injected variables.
//As default, it will recognize localhost (for dev purposes).
//To run dockerized, use: npm run docker
const mongoSrv = process.env.DB_HOST ?? "localhost"
const mongoPort = process.env.DB_POST ?? "27017"
const connection = `mongodb://${mongoSrv}:${mongoPort}/bodega`;

const guidExample = "f4b23110-a319-11ea-94a8-835ccf0337c7";
const skuExample = "ABCDEF1234";
const productExample = "Producto X";
const cantidadExample = 10;
const dateExample = 1590914246305;

const articuloSchema = Joi.object()
    .keys({
        _id: Joi.string().guid().example(guidExample),
        sku: Joi.string().min(10).max(10).required().example(skuExample),
        descripcion: Joi.string().min(10).max(100).required().example(productExample),
        cantidad: Joi.number().required().example(cantidadExample),
        fecha_ingreso: Joi.date().example(dateExample)
    }).label('Articulo');

//Simple CRUD in REST:
//GET -> READ
//POST -> CREATE
//PATCH -> UPDATE
//DELETE -> DELETE
module.exports = [
    {
        method: 'GET',
        path: '/articulo',
        options: {
            description: 'Show all articles registered',
            notes: 'Returns all articles registered in the storage.',
            tags: ['api'], // ADD THIS TAG
            plugins: {
                'hapi-swagger':{
                    responses: {
                        '200': {
                            description: "Returns array of articles",
                            schema: Joi.array().items(articuloSchema).label('Articulos')
                        },
                        '400': {
                            description: "Problems connecting to DB",
                        }
                    }
                }
            }
        },
        handler: async (request, h) => {
            const db = mongojs(connection);
            
            if(db){
                //Since the DB is an async function, promise an answer.
                var execute = () => { 
                    return new Promise((resolve, reject) => {
                        db
                        .collection('articulos') //Connect to collection articulos.
                        .find({},function(err,res){
                            //Once resolved, close the connection.
                            db.close();
                            //If there are any errors, reject.
                            if(err){
                                reject(Boom.forbidden(err));
                            }
                            //Finally, return the promise.
                            resolve(res);
                        }); //Fetch all.
                    });
                };

                //Execute the promise
                var articulos = await execute();
                
                return articulos;
            } else {
                return Boom.badImplementation("Problems with db connection.");
            }
        }
    },
    {
        method: 'POST',
        path: '/articulo',
        options: {
            description: 'Add new articule',
            notes: 'Add an article to storage.',
            tags: ['api'], // ADD THIS TAG
            plugins: {
                'hapi-swagger':{
                    responses: {
                        '200': {
                            description: "Return registered article",
                            schema: articuloSchema
                        },
                        '400': {
                            description: "Problems connecting to DB",
                        }
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    //sku is defined as ABCCDE1234. This will be represented as ABC-CDE-1234.
                    sku: Joi.string().min(10).max(10).required().example(skuExample),
                    //descripcion will be defined between 10 and 255 characters
                    descripcion: Joi.string().min(10).max(100).required().example(productExample),
                    //cantidad is an integer
                    cantidad: Joi.number().required().example(cantidadExample)
                }).label('AddArticulo'),
                failAction: async (request, h, err) => {
                    console.error(err);
                    throw err;
                }
            }
        },
        handler: async (request, h) => {
            const db = mongojs(connection);
            
            if(db){
                //Obtain Json object.
                const payload = request.payload;
                
                //Create an id
                payload._id = uuid.v1();
                
                //Set the time the product was entered.
                payload.fecha_ingreso = Date.now();
                
                //Since the DB is an async function, promise an answer.
                var execute = () => { 
                    return new Promise((resolve, reject) => {
                        db
                        .collection('articulos') //Connect to collection articulos.
                        .insert(payload, function(err,res){
                            //Once resolved, close the connection.
                            db.close();
                            //If there are any errors, reject.
                            if(err){
                                reject(Boom.forbidden(err));
                            }
                            //Finally, return the promise.
                            resolve(res);
                        }); //Insert.
                    });
                };
                
                //Execute the promise
                var status = await execute();
                
                return status;
            } else {
                return Boom.badImplementation("Problems with db connection.");
            }
        }
    },
    {
        method: 'PATCH',
        path: '/articulo/{id}',
        options: {
            description: 'Update an existing articule',
            notes: 'Update values for existing article',
            tags: ['api'], // ADD THIS TAG
            plugins: {
                'hapi-swagger':{
                    responses: {
                        '200': {
                            description: "Return patch status.",
                            schema: Joi.object().keys({
                                n: Joi.number().example(1),
                                nModified: Joi.number().example(0),
                                ok: Joi.number().example(1)
                            }).label('PatchStatus')
                        },
                        '400': {
                            description: "Problems connecting to DB",
                        }
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    //sku is defined as ABC-CDE-1234
                    sku: Joi.string().min(10).max(10).example(skuExample),
                    //descripcion will be defined between 10 and 255 characters
                    descripcion: Joi.string().min(10).max(100).example(productExample),
                    //cantidad is an integer
                    cantidad: Joi.number().example(cantidadExample),
                    // fecha_ingreso is a date.
                    fecha_ingreso: Joi.date().example(dateExample)
                }).label('UpdateArticulo'),
                params: Joi.object({
                    id: Joi.string().guid().example(guidExample).description('GUID code')
                }),
                failAction: async (request, h, err) => {
                    console.error(err);
                    throw err;
                }
            }
        },
        handler: async (request, h) => {
            const db = mongojs(connection);
            
            if(db){
                //Search the object through the id.
                const id = request.params.id;
                
                //Obtain Json object.
                const payload = request.payload;

                //Since the DB is an async function, promise an answer.
                var execute = () => { 
                    return new Promise((resolve, reject) => {
                        db
                        .collection('articulos') //Connect to collection articulos.
                        .updateOne({_id: id}, {$set: payload}, function(err, res){
                            //Once resolved, close the connection.
                            db.close();
                            //If there are any errors, reject.
                            if(err){
                                reject(Boom.forbidden(err));
                            }
                            //Finally, return the promise.
                            resolve(res);
                        }); //Update.
                    });
                };
                
                //Execute the promise
                var status = await execute();
                
                return status;
            } else {
                return Boom.badImplementation("Problems with db connection.");
            }
        }
    },
    {
        method: 'DELETE',
        path: '/articulo/{id}',
        options: {
            description: 'Delete an existing articule',
            notes: 'Delete existing article',
            tags: ['api'], // ADD THIS TAG
            plugins: {
                'hapi-swagger':{
                    responses: {
                        '200': {
                            description: "Return delete status.",
                            schema: Joi.object().keys({
                                n: Joi.number().example(1),
                                ok: Joi.number().example(1),
                                deletedCount: Joi.number().example(1)
                            }).label('DeleteStatus')
                        },
                        '400': {
                            description: "Problems connecting to DB",
                        }
                    }
                }
            },
            validate: {
                params: Joi.object({
                    id: Joi.string().guid().example(guidExample).description('GUID code')
                })
            }
        },
        handler: async (request, h) => {
            const db = mongojs(connection);
            
            if(db){
                //Search the object through the id.
                const id = request.params.id;

                //Since the DB is an async function, promise an answer.
                var execute = () => { 
                    return new Promise((resolve, reject) => {
                        db
                        .collection('articulos') //Connect to collection articulos.
                        .remove({_id: id}, function(err, res){
                            //Once resolved, close the connection.
                            db.close();
                            //If there are any errors, reject.
                            if(err){
                                reject(Boom.forbidden(err));
                            }
                            //Finally, return the promise.
                            resolve(res);
                        }); //Update.
                    });
                };
                
                //Execute the promise
                var status = await execute();
                
                return status;
            } else {
                return Boom.badImplementation("Problems with db connection.");
            }
        }
    }
];