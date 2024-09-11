import * as npc from 'dcl-npc-toolkit-ai-version'
import {NPCBodyType} from "dcl-npc-toolkit-ai-version/dist/types";
import { isPreviewMode } from '~system/EnvironmentApi';
import { previewFileUrl, previewUrl, productionFileUrl, productionUrl } from '../modules/global';
import { createText } from '../modules/titleText';
import { Quaternion, Vector3 } from '@dcl/sdk/math';

export async function createNpc(model: string, rag: boolean, configured: boolean, transform: any, text: string = "") {

    const isPreview = await isPreviewMode({});
    let ENDPOINT, FILE_SERVER

    ENDPOINT = (isPreview.isPreview)
        ? previewUrl // local environment
        : productionUrl; // production environment insert if needed
    FILE_SERVER = (isPreview.isPreview)
        ? previewFileUrl
        : productionFileUrl

    const NPC = npc.create(
        transform,
        //NPC Data Object
        {
            type: npc.NPCType.CUSTOM,
            body: NPCBodyType.MALE,
            model: model,
            idleAnim: 'Idle',
            faceUser: true,
            turningSpeed: 10,
            onlyClickTrigger: true,
            //onlyExternalTrigger: true,

            onActivate: async (data) => {
                npc.initAiDialog(NPC);
            },
            onWalkAway: async (data) => {
                //console.log('npc walkAway', data)
            }
        },false,configured,ENDPOINT,"lobby_room",FILE_SERVER
    )
    let textPos = {...transform.position};
    let textParams = {
        position: Vector3.create(textPos.x, textPos.y + 2, textPos.z),
        rotation: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0)
    };
    createText(textParams, text);

    return NPC
}
