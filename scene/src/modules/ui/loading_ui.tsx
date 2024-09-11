import ReactEcs, {Input, Label, UiEntity} from "@dcl/sdk/react-ecs"
import resources from "../resources"
import {Color4} from "@dcl/sdk/math"
import {modalFontScale, modalScale, targetHeight} from "./UIGlobals"
import { Spinner, UISpinner } from "./ui_components/UISpinner";

let isVisible: boolean = false;

const modalWidth = 100
const modalHeight = 100

export const loadingUI = () => {
    return (
        <UiEntity //Invisible Parent
            uiTransform={{
                positionType: 'absolute',
                width: getScaledSize(modalWidth),
                height: getScaledSize(modalHeight),
                position: {bottom: getScaledSize((targetHeight - modalHeight) / 2), left: '50%'},
                margin: {left: -getScaledSize(modalWidth) / 2},
                display: isVisible ? 'flex' : 'none'
            }}
        >
            <UISpinner // Loading spinner
                spinner={spinner}
                uiTransform={{
                    positionType: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
            </UISpinner>
        </UiEntity>
    )
}

let spinner = new Spinner("images/loadingSpinner.png", 1000);
spinner.show();

function getScaledSize(size: number): number {
    return size * modalScale
}

function getScaledFontSize(size: number): number {
    return size * modalFontScale
}

function setVisibility(status: boolean): void {
    isVisible = status
}

export function closeLoading(triggerWalkAway: boolean = true) {
    if (isVisible == false) return
    setVisibility(false)
    if (!triggerWalkAway) return
}

export function invokeLoading() {
    setVisibility(true)
}