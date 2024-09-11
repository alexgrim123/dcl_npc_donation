import ReactEcs, {UiEntity} from "@dcl/sdk/react-ecs"
import {modalScale, targetHeight, targetWidth} from "./UIGlobals"
import { NpcUtilsUi } from "dcl-npc-toolkit-ai-version"

const modalWidth = 1000;
const modalHeight = 625;
export const npcUI = () => {
    return (
        <UiEntity
            uiTransform={{
                positionType: 'absolute',
                
                width: getScaledSize(modalWidth),
                height: getScaledSize(modalHeight),
                position: {bottom: getScaledSize(40), left: '50%'},
                margin: {left: -getScaledSize(modalWidth) / 2},
                display: 'flex'
            }}
        >
            <NpcUtilsUi/>
        </UiEntity>
    )
}

function getScaledSize(value: number) {
    return value*modalScale;
}