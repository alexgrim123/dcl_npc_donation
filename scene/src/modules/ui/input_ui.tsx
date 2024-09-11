import ReactEcs, {Input, Label, UiEntity} from "@dcl/sdk/react-ecs"
import resources from "../resources"
import {Color4} from "@dcl/sdk/math"
import {modalFontScale, modalScale, targetHeight} from "./UIGlobals"

let isVisible: boolean = false
let input_title: string = ""
let input_description: string = ""
let current_input: string = ""
let input_callback: any = () => {
}

const modalWidth = resources.images.ui.ui_promts.notification.sourceWidth/2
const modalHeight = resources.images.ui.ui_promts.notification.sourceHeight/2

export const inputUI = () => {
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

            <UiEntity //Dialog Holder
                uiTransform={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'space-around',
                    alignItems: 'stretch',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row'
                }}
                uiBackground={{
                    texture: {src: resources.images.ui.ui_promts.notification.src},
                    textureMode: 'stretch'
                }}
            >

                <UiEntity //TOP
                    uiTransform={{
                        width: '100%',
                        height: '10%',
                        margin: {top: '2%'},
                        justifyContent: 'center'
                    }}
                >

                    <UiEntity
                        uiTransform={{
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center'
                        }}
                    >
                        <Label
                            value={`<b>${input_title}</b>`}
                            fontSize={getScaledFontSize(28)}
                        ></Label>

                    </UiEntity>

                    <UiEntity //Close icon
                        uiTransform={{
                            positionType: 'absolute',
                            position: {top: '6.5%', right: '3%'},
                            width: getScaledSize(resources.images.ui.buttons.closeButton.sourceWidth / 4.0),
                            height: getScaledSize(resources.images.ui.buttons.closeButton.sourceHeight / 4.0),
                        }}
                        onMouseDown={() => {
                            closeInput(true)
                        }}
                        uiBackground={{
                            texture: {src: resources.images.ui.buttons.closeButton.src},
                            textureMode: 'stretch',
                            color: Color4.White()
                        }}
                    ></UiEntity>

                </UiEntity>

                <UiEntity // description
                    uiTransform={{
                        width: '95%',
                        height: '20%',
                        flexDirection: 'column',
                    }}
                >
                    <Label
                        value={`<b>${input_description}</b>`}
                        fontSize={getScaledFontSize(28)}
                    ></Label>
                </UiEntity>

                <UiEntity //Input
                    uiTransform={{
                        height: '15%',
                        width: '85%'
                    }}
                    uiBackground={{
                        texture: {src: resources.images.ui.ui_promts.input_field.src},
                        textureMode: 'stretch'
                    }}

                >

                    {editInputUI()}

                </UiEntity>

                <UiEntity //Footer
                    uiTransform={{
                        width: '100%',
                        height: '12%',
                        flexDirection: 'row'
                    }}
                    //uiBackground={{textureMode:'stretch', color: Color4.Green()}}
                >

                    <UiEntity //Yes
                        uiTransform={{
                            positionType: 'absolute',
                            position: {right: "20%"},
                            width: getScaledSize(resources.images.ui.buttons.yesButton.sourceWidth / 3.0),
                            height: getScaledSize(resources.images.ui.buttons.yesButton.sourceHeight / 3.0),
                        }}
                        onMouseDown={() => {
                            input_callback(current_input);
                            closeInput(true);
                        }}
                        uiBackground={{
                            texture: {src: resources.images.ui.buttons.yesButton.src},
                            textureMode: 'stretch',
                            color: Color4.White()
                        }}
                    ></UiEntity>

                    <UiEntity //No
                        uiTransform={{
                            positionType: 'absolute',
                            position: {left: "20%"},
                            width: getScaledSize(resources.images.ui.buttons.noButton.sourceWidth / 3.0),
                            height: getScaledSize(resources.images.ui.buttons.noButton.sourceHeight / 3.0),
                        }}
                        onMouseDown={() => {
                            closeInput(true)
                        }}

                        uiBackground={{
                            texture: {src: resources.images.ui.buttons.noButton.src},
                            textureMode: 'stretch',
                            color: Color4.White()
                        }}
                    ></UiEntity>

                </UiEntity>
            </UiEntity>
        </UiEntity>
    )
}

const editInputUI = () => {
    if (isVisible) {
        return (
            <UiEntity
                uiTransform={{
                    width: "95%",
                    height: '80%',
                    margin: {left: "2.5%", top: '1%'}
                }}
            >

                <Input
                    uiTransform={{
                        width: "100%",
                        height: '100%'
                    }}
                    fontSize={getScaledFontSize(20)}
                    placeholder={isVisible ? "Input here" : "Error"}
                    color={Color4.White()}
                    placeholderColor={Color4.White()}
                    onSubmit={() => {
                        input_callback(current_input);
                    }}
                    onChange={(x) => {
                        onEdit(x)
                    }}
                />
            </UiEntity>)
    } else {
        return (<UiEntity></UiEntity>)
    }
}

function getScaledSize(size: number): number {
    return size * modalScale
}

function getScaledFontSize(size: number): number {
    return size * modalFontScale
}

function setVisibility(status: boolean): void {
    isVisible = status
}

export function isInputVisible() {
    return isVisible;
}

export function closeInput(triggerWalkAway: boolean = true) {
    if (isVisible == false) return
    setVisibility(false)
    if (!triggerWalkAway) return
}

export function invokeInput(title: string, text: string, callback: any, initial_value: string = "") {
    input_title = title;
    input_description = text;
    input_callback = callback;
    setVisibility(true)
}

function onEdit(param: string) {
    current_input = param;
}
