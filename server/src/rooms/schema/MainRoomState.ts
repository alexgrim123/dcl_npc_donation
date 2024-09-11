import {Schema, MapSchema, type} from "@colyseus/schema";
import { Client } from "colyseus";

export class Player extends Schema {
    @type('string') address: string;
    client: Client;
    stellarAddress: string = "";

    constructor(client: Client) {
        super();
        this.client = client;
    }

}

export class MainRoomState extends Schema {
    @type("string") myString: string = ""
    @type({ map: "string" }) myMap = new MapSchema<string>()
}