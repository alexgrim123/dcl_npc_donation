import {
    Entity,
    GltfContainer,
    InputAction,
    Material,
    MeshCollider,
    MeshRenderer,
    PointerEventType,
    PointerEvents,
    TextureFilterMode,
    TextureWrapMode,
    Transform,
    VisibilityComponent,
    engine,
    inputSystem
} from "@dcl/sdk/ecs";
import {Quaternion, Vector3} from "@dcl/sdk/math";
import {globalRoom, qrFileUrl} from "./global";
import {invokeInput} from "./ui/input_ui";
import * as utils from '@dcl-sdk/utils';
import { createText } from "./titleText";

export let banner: CustomPainting;

export class CustomPainting {

    picture: Entity;
    mainEntity: Entity;

    constructor(position: Vector3) {
        banner = this;
        this.mainEntity = engine.addEntity();
        Transform.create(this.mainEntity, {position: position, scale: Vector3.create(3, 3, 0.1)});
        MeshRenderer.setBox(this.mainEntity);
        MeshCollider.setBox(this.mainEntity);
        this.picture = engine.addEntity();
        MeshRenderer.setPlane(this.picture);
        VisibilityComponent.create(this.mainEntity, {visible: false});
        VisibilityComponent.create(this.picture, {visible: false});
        const params = {
            pos: Vector3.create(0, 0, 2), // 0, 0.7
            rot: Quaternion.fromEulerDegrees(0.0, 0.0, 0.0),
            scale: Vector3.create(1, 1, 1)
        };
        let textParams = {
            pos: {...position},
            rot: Quaternion.fromEulerDegrees(0.0, 180.0, 0.0),
            scale: Vector3.create(1, 1, 1)
        };
        textParams.pos.y += 2;
        Transform.create(this.picture, {
            parent: this.mainEntity,
            position: params.pos,
            rotation: params.rot,
            scale: params.scale
        });
        this.invokePointer();
        // createText({
        //     position: textParams.pos,
        //     rotation: textParams.rot,
        //     scale: textParams.scale
        // },"Donate");
        this.loadAdditionalData(qrFileUrl);
    }

    loadAdditionalData(input: string) {
        Material.setPbrMaterial(this.picture, {
            texture: Material.Texture.Common({
                src: input,
                filterMode: TextureFilterMode.TFM_BILINEAR,
                wrapMode: TextureWrapMode.TWM_CLAMP,
            }),
        });
    }

    sendNewPrompt(input: string) {
        if (globalRoom != undefined) {
            console.log("SENDING PROMPT", input)
            if (!isNaN(Number(input))) {
                globalRoom.send("donation", {
                    amount: Number(input)
                })
            }
        }
    }

    invokePointer() {
        PointerEvents.create(this.mainEntity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        hoverText: "Donate",
                        maxDistance: 50
                    }
                },
            ]
        })
        let pointerSystem = () => {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.mainEntity)) {
                // invokeInput("DONATION", "INPUT DONATION AMOUNT",
                //     (input: string) => {
                //         this.sendNewPrompt(input);
                //     }
                // )
            }
        }
        engine.addSystem(pointerSystem);
    }

    setVisibility(newMode: boolean) {
        VisibilityComponent.getMutable(this.mainEntity).visible = newMode;
        VisibilityComponent.getMutable(this.picture).visible = newMode;
    }
}

export class donationNPC {
    mainEntity: Entity;

    constructor(position: Vector3, model: string) {
        this.mainEntity = engine.addEntity();
        Transform.create(this.mainEntity, {position: position, scale: Vector3.create(1, 1, 1)});
        GltfContainer.create(this.mainEntity, { src: model,  });
        this.invokePointer();
    }

    invokePointer() {
        PointerEvents.create(this.mainEntity, {
            pointerEvents: [
                {
                    eventType: PointerEventType.PET_DOWN,
                    eventInfo: {
                        button: InputAction.IA_POINTER,
                        hoverText: "Donate",
                        maxDistance: 50
                    }
                },
            ]
        })
        let pointerSystem = () => {
            if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.mainEntity)) {
                banner.setVisibility(true);
            }
        }
        engine.addSystem(pointerSystem);
    }
}