import {Client, Room} from "colyseus";
import {MainRoomState, Player} from "./schema/MainRoomState";
import { aiSystemConfig, mainChain, voiceGenerationEnabled } from "../globals";
import { getLLMTextAndVoice, modelTypes, generateAndSaveImage, generateMusic, getLLMTextAndVoiceConfigured, inpaintImage, generateMusicOS, getOllamaTextAndVoice } from "llm_response";
import { appReadyPromise } from "../app.config";
import { getOllamaText, setOSVoiceGeneration } from "llm_response/dist/generations";
import { atc } from "../utils";
import * as QrCode from "qrcode";
import * as StellarSdk from "stellar-sdk";
import path from "path";
require('dotenv').config();
const express = require('express')
const app = express()
require('path');

let userState = new Map<string,Player>();

app.get('/login', async (req: any, res: any) => {
    const sessionId = req.query.sessionId;
    const signedXDR = req.body.xdr; // The signed XDR from the wallet

    // Parse the signed transaction XDR
    const tx = new StellarSdk.Transaction(signedXDR, StellarSdk.Networks.PUBLIC);

    // Get the signer's public key (the user's Stellar address)
    const signerPublicKey = tx.signatures[0].hint().toString('hex');
    let user = userState.get(sessionId);
    user.address = signerPublicKey;
    userState.set(sessionId, user);
    console.log('Received signer public key:', signerPublicKey);

    // Respond to the wallet
    res.status(200).send('Address received successfully!');
})

// Add these lines to specify the port and start the server
app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.EXPRESS_PORT}`);
});

export class MainRoom extends Room<MainRoomState> {
    onCreate(options: any) {
        this.setState(new MainRoomState());
        this.setUp(this);
        this.setSeatReservationTime(60);
        this.maxClients = 100;

        console.log("process.env.SERVER_FILE_URL", process.env.SERVER_FILE_URL)
        console.log("process.env.PORT", process.env.PORT)
        console.log("process.env.OPEN_API_KEY", process.env.OPEN_API_KEY)
        console.log("process.env.REPLICATE_API_TOKEN", process.env.REPLICATE_API_TOKEN)
        console.log("process.env.INPAINT_URL", process.env.INPAINT_URL)
        console.log("process.env.OLLAMA_MODEL", process.env.OLLAMA_MODEL)
        console.log("process.env.OLLAMA_BASE_URL", process.env.OLLAMA_BASE_URL)

        // This listener part is used to handle all NPC's interactions and generate prompts under different conditions
        this.onMessage("getAnswer", async (client, msg) => {

            atc("getAnswer",async ()=>{
                //const systemMessage = 'You are NPC that knows everything about Decentraland. You try to be nice with anyone and make friendship';
                // Responses for queries are generated here
                let text = "";
                let voiceUrl = "";

                if (msg.rag) {
                    // When rag is on, it uses rag system setup in index.ts (openAI for now)
                    setOSVoiceGeneration(false); // Voice generation from openAI is used
                    const result = await mainChain.getRagAnswer(msg.text,voiceGenerationEnabled,await appReadyPromise);
                    text = result.response.text;
                    voiceUrl = result.exposedUrl;
                } else {
                    // when rag is not used, it will then check configured flag
                    let result = undefined;
                    if (!msg.configured) {
                        // Non configured leads to Ollama response generation
                        setOSVoiceGeneration(true); // Local voice generation is used
                        result = await getOllamaTextAndVoice(msg.text, await appReadyPromise);
                    } else {
                        // Configured leads to OpenAI response generation, including config file
                        setOSVoiceGeneration(false); // Voice generation from openAI is used
                        result = await getLLMTextAndVoiceConfigured(aiSystemConfig,msg.text,await appReadyPromise);
                    }
                    text = result.response;
                    voiceUrl = result.exposedUrl;
                    console.log("VOICE URL: ", voiceUrl);
                }

                setTimeout(()=>{
                    client.send("getAnswer", {
                        answer: text,
                        voiceUrl: voiceUrl,
                        voiceEnabled: voiceGenerationEnabled,
                        id: msg.id
                    });
                },5000)
            })
        })
    }

    async setUp(room: Room) {
        try {
            console.log("Setting up lobby room...");
            console.log("process.env.SERVER_FILE_URL", process.env.SERVER_FILE_URL)
            console.log("process.env.PORT", process.env.PORT)
            console.log("process.env.OPEN_API_KEY", process.env.OPEN_API_KEY)
            console.log("process.env.REPLICATE_API_TOKEN", process.env.REPLICATE_API_TOKEN)
            console.log("process.env.INPAINT_URL", process.env.INPAINT_URL)
            console.log("process.env.OLLAMA_MODEL", process.env.OLLAMA_MODEL)
            console.log("process.env.OLLAMA_BASE_URL", process.env.OLLAMA_BASE_URL)
        } catch (error) {
            console.error("Error in createImage handler:", error);
        }
    }

    async onJoin(client: Client, options: any) {
        console.log("Joined lobby room successfully...");
        userState.set(client.sessionId, new Player(client));
        const qrFileName = `donate-qr-${client.sessionId}`;
        
        const defaultDonation = 20
        const qrFilePath = path.join(__dirname, `../../images/${qrFileName}.png`)
        await QrCode.toFile(qrFilePath, `web+stellar:pay?destination=${process.env.STELLAR_WALLET}&amount=${defaultDonation}`)
        const qrFileUrl = `${process.env.SERVER_FILE_URL}/images/${qrFileName}.png`
        client.send("donateQr", qrFileUrl)
    }

    async onLeave(client: Client, consented: boolean) {
        console.log("Leaving lobby room successfully...");
    }

    async onDispose() {
        console.log("Disposed lobby room successfully...");
    }

}

function exposeLocalUrl(baseFolder: string, filePath: string, app: any) {
    // Getting voice source
    if (!app)
        return ``;
    const urlPath = `/${baseFolder}/${path.basename(filePath)}`;
    app.get(urlPath, (req: any, res: any) => {
        const absolutePath = path.resolve(filePath);
        res.sendFile(absolutePath, (err: any) => {
            if (err) {
                console.error(`Error serving ${absolutePath}:`, err);
                res.status(500).send("Error serving file");
            }
        });
    });
    return urlPath;
}
