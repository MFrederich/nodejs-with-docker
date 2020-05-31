'use strict';

const uuid = require('node-uuid');  
const mongojs = require('mongojs');

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi');

//To configure the connection, we are going to use injected variables.
//As default, it will recognize localhost (for dev purposes).
//To run dockerized, use: npm run docker
const mongoSrv = process.env.MONGOSRV ?? "localhost"
const connection = `mongodb://${mongoSrv}:27017/bodega`;

//Simple CRUD in REST:
//GET -> READ
//POST -> CREATE
//PATCH -> UPDATE
//DELETE -> DELETE
module.exports = [
    {
        method: 'GET',
        path: '/articulo',
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
        config: {
            validate: {
                payload: Joi.object({
                    //sku is defined as ABC-CDE-1234
                    sku: Joi.string().min(10).max(10).required(),
                    //descripcion will be defined between 10 and 255 characters
                    descripcion: Joi.string().min(10).max(100).required(),
                    //cantidad is an integer
                    cantidad: Joi.number().required()
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
        config: {
            validate: {
                payload: Joi.object({
                    //sku is defined as ABC-CDE-1234
                    sku: Joi.string().min(10).max(10),
                    //descripcion will be defined between 10 and 255 characters
                    descripcion: Joi.string().min(10).max(100),
                    //cantidad is an integer
                    cantidad: Joi.number()
                }),
                params: Joi.object({
                    id: Joi.string().guid()
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
            validate: {
                params: Joi.object({
                    id: Joi.string().guid()
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