// async wrapper
export async function atc(name:string, func: any) {
    try {
        await func();
    } catch (e: any) {
        console.log(`Wrapper error: ${name}. ${e}`);
    }
}
// basic wrapper
export function tc(name:string, func: any) {
    try {
        func();
    } catch (e: any) {
        console.log(`Wrapper error: ${name}. ${e}`);
    }
}