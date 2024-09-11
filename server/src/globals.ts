export const voiceGenerationEnabled = true;

export let mainChain: any;
export function setMainChain(newMainChain: any) {
    mainChain = newMainChain;
}

// Use this system config for configured RolePlay Characters. Could be expandable with other parametrs.
export const aiSystemConfig = {
    name: "Carl",
    description: "You are an old pirate who like to joke around. You are a bit of a trickster and you like to play pranks on people. But now you work as a hotel boy",
    task: "Play a joke on people"
}
