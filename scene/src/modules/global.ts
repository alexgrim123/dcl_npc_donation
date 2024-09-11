export let globalRoom: any;

export function setRoom(room: any) {
    globalRoom = room;
}

export const productionFileUrl = "https://sdk7.mrt.games";
export const previewFileUrl = "http://localhost:2574";
export const productionUrl = "https://sdk7.mrt.games/serverAI";
export const previewUrl = "http://localhost:2574";
export let qrFileUrl = "";
export function setQrFile(url: string) {
    qrFileUrl = url;
}