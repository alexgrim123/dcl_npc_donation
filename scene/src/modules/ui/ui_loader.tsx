import {engine, PBUiCanvasInformation, UiCanvasInformation} from '@dcl/sdk/ecs'
import ReactEcs, {ReactEcsRenderer} from '@dcl/sdk/react-ecs'
import {inputUI} from './input_ui'
import {render} from 'dcl-ui-toolkit'
import {setModalScale, targetHeight, targetWidth} from './UIGlobals'
import { npcUI } from './npc_ui'
import { NpcUtilsInputUi, NpcUtilsLoadingUi } from 'dcl-npc-toolkit-ai-version'
import { loadingUI } from './loading_ui'

let devicePixelRatioScale: number = 1

export function updateUIScalingWithCanvasInfo(canvasInfo: PBUiCanvasInformation) {
    devicePixelRatioScale = 1920 / 1080 / canvasInfo.devicePixelRatio

    const scale = targetWidth / canvasInfo.width < targetHeight / canvasInfo.height ?
        canvasInfo.width / targetWidth : canvasInfo.height / targetHeight
    setModalScale(scale);
}

const uiComponent = () => [
    inputUI(),
    npcUI(),
    NpcUtilsInputUi(),
    NpcUtilsLoadingUi(),
    loadingUI(),
    render()
]

export let canvasInfo: PBUiCanvasInformation = {
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    interactableArea: undefined
}

let setupUiInfoEngineAlready = false

export function setupUiInfoEngine() {
    if (setupUiInfoEngineAlready) return

    setupUiInfoEngineAlready = true

    let maxWarningCount = 20
    let warningCount = 0
    engine.addSystem((deltaTime) => {
        const uiCanvasInfo = UiCanvasInformation.get(engine.RootEntity)

        if (!uiCanvasInfo) {
            warningCount++
            if (warningCount < maxWarningCount) {
                console.log('setupUiInfoEngine', 'WARNING ', warningCount, 'screen data missing: ', uiCanvasInfo)
            }
            return
        } else if (maxWarningCount > 0) {
            maxWarningCount = 0
            console.log('setupUiInfoEngine', 'FIXED ' + 'screen data resolved: ', uiCanvasInfo)
        }

        if (canvasInfo.width === uiCanvasInfo.width && canvasInfo.height === uiCanvasInfo.height) return

        console.log('setupUiInfoEngine', 'Updated', 'Width', canvasInfo.width, 'Height:', canvasInfo.height)
        canvasInfo.width = uiCanvasInfo.width
        canvasInfo.height = uiCanvasInfo.height
        canvasInfo.devicePixelRatio = uiCanvasInfo.devicePixelRatio
        canvasInfo.interactableArea = uiCanvasInfo.interactableArea

        updateUIScalingWithCanvasInfo(canvasInfo)

    })
}

export function setupUi() {
    setupUiInfoEngine()
    ReactEcsRenderer.setUiRenderer(uiComponent)
}
