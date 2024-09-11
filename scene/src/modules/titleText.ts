import { TextShape, Transform, engine } from "@dcl/sdk/ecs";
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math";

export function createText(transform: any, text: string) {

    let textEntity = engine.addEntity();
    TextShape.create(textEntity,{
        text: text,
        textWrapping: true,
        outlineWidth: 0.2,
        outlineColor: Color4.Black(),
        width: 3,
        height: 3,
        fontSize: 1
    })
    Transform.create(textEntity,transform)
}