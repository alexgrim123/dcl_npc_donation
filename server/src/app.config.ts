import config from "@colyseus/tools";
import express from "express";
import cors from 'cors'
import {MainRoom} from "./rooms/MainRoom";
import { WebSocketTransport } from  "@colyseus/ws-transport"
import { LocalPresence, RedisDriver, RedisPresence } from "colyseus";
import {connectToRoom} from "./rooms/client";

import EventEmitter from "events";
import path from "path";


const appEmitter = new EventEmitter();
let appReadyPromiseResolve: (arg0: express.Express) => void;
const appReadyPromise = new Promise((resolve) => {
    appReadyPromiseResolve = resolve;
});


export default config({
    getId: () => "Your Colyseus App",
    options: {

        presence: new LocalPresence()
    },

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer
            .define('lobby_room', MainRoom)
            .filterBy(['realm'])
            .enableRealtimeListing()

    },

    initializeTransport: (options) => {

        return new WebSocketTransport({
            ...options,
            pingInterval: 3000,
            pingMaxRetries: 6,
        });
    },

    initializeExpress: (app) => {
        app.use(express.json());
        app.use(express.urlencoded({extended: true, limit: "10kb"}));

        const allowlist = ['https://play.decentraland.org', 'https://play.decentraland.zone']
        const corsOptionsDelegate = (req: any, callback: any) => {

            try {
                let corsOptions;
                if (allowlist.indexOf(req.header('Origin')) !== -1) {
                    corsOptions = {origin: true} // reflect (enable) the requested origin in the CORS response
                } else {
                    corsOptions = {origin: false} // disable CORS for this request
                }
                callback(null, corsOptions) // callback expects two parameters: error and options
            } catch (e) {
                console.log("Error in cors option delegate", e)
            }
        }

        app.use(cors(corsOptionsDelegate))

        appReadyPromiseResolve(app)
        appEmitter.emit("appReady", app)


        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        app.use('/voices', express.static(path.join(__dirname,'../voices')));
        app.use('/images', express.static(path.join(__dirname,'../images')));
        app.use('/music', express.static(path.join(__dirname,'../music')));


        },



    beforeListen: () => {
        connectToRoom()

    }
});

export { appReadyPromise };
