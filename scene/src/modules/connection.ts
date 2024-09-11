import {Client, Room} from "colyseus.js"
import {getCurrentRealm, isPreviewMode} from "~system/EnvironmentApi"
import {getUserData} from "~system/UserIdentity"
import {previewUrl, productionUrl, qrFileUrl, setQrFile, setRoom} from "./global"
import {banner} from "./banner"
import {AudioStream, AvatarAttach, engine} from "@dcl/sdk/ecs";
import { setCustomServerUrl } from "dcl-npc-toolkit-ai-version"
import * as utils from '@dcl-sdk/utils';
import { closeLoading, invokeLoading } from "./ui/loading_ui"
import { tc } from "../utils/utils"

export class NetworkManager {
    client!: Client
    room!: Room
    roomName!: string
    roomId!: string
    options!: any
    userData!: any

    constructor(roomName: string, options: any, userData: any, roomId: string = 'id') {
        this.roomName = roomName
        this.options = options
        this.userData = userData
        this.roomId = roomId
    }

    async start() {
        console.log("GETTING ENDPOINT");
        try {
            this.client = new Client(await getEndpoint());
        } catch (e) {
            console.log("SOMETHING WENT WRONG", `${e}`);
        }
        console.log("GOT CLIENT");
        await this.getUserData()
        await this.connect();

    }

    async getUserData() {
        const realm = await getCurrentRealm({});
        this.options.realm = realm.currentRealm?.displayName;

        if (!this.userData) {
            let tmpData = (await getUserData({})).data;
            this.options.userData = {
                publicKey: tmpData?.publicKey,
                displayName: tmpData?.displayName,
                userId: tmpData?.userId
            };
        } else {
            this.options.userData = this.userData
        }
    }

    async connect() {
        try {
            if (this.roomName == "lobby_room") {
                console.log("CONNECTING...")
                const availableRooms = await this.client.getAvailableRooms(this.roomName);

                let roomExist = false
                let connectId = this.options.roomId;
                for (let room of availableRooms) {
                    if (room.roomId == this.options.roomId) {
                        roomExist = true
                    }
                }

                this.room = !roomExist ? await this.client.create<any>(this.roomName, this.options)
                    : await this.client.joinById<any>(connectId, this.options)

                await this.addLobbyListeners();

                console.log("joined successfully to lobby:", this.room);
            }

            return this.room


        } catch (e) {
            console.log("CONNECTING FAILED...")
            console.log("e", `${e}`);
        }
    }

    async addLobbyListeners() {
        this.room.onMessage("donateQr", async (msg) => {
            tc("donation",async ()=>{
                console.log("SET QR: ", msg);
                setQrFile(msg);
                if (banner)
                    banner.loadAdditionalData(msg);
            })
        })

        this.room.onMessage("stopLoading", async (msg) => {
            tc("loadingIconStop",async ()=>{
                closeLoading();
            })
        })

        this.room.onMessage("startLoading", async (msg) => {
            tc("loadingIconStart",async ()=>{
                console.log("LOADING ICON INIT");
                invokeLoading();
            })
        })
    }
}

export async function getEndpoint() {
    const isPreview = await isPreviewMode({});
    let ENDPOINT

    const realm = await getCurrentRealm({})
    console.log("REALM", realm)
    console.log("PREVIEW MODE", isPreview.isPreview);

    ENDPOINT = (isPreview.isPreview)
        ? previewUrl // local environment
        : productionUrl; // production environment insert if needed
    setCustomServerUrl(previewUrl);

    console.log("GOT ENDPOINT", ENDPOINT);

    return ENDPOINT

}

export async function connectionColyseus(userData: any, secondConnection: boolean = false) {
    const networkManagerLobby = new NetworkManager(
        "lobby_room", {
            roomId: "lobby",
            secondConnection: secondConnection
        }, {
            publicKey: userData.publicKey,
            displayName: userData.displayName,
            userId: userData.userId
        });
    await networkManagerLobby.start();

    setRoom(networkManagerLobby.room);
    return networkManagerLobby.room;
}
