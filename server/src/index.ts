import { listen } from "@colyseus/tools";

// Import app config
import appConfig from "./app.config";
import { createRagChain, modelTypes, setupInpaintUrl, setupOpenAIKey, setupReplicateKey } from "llm_response";
import { setMainChain } from "./globals";
import { setOSVoiceGeneration, setupOllama } from "llm_response/dist/generations";

// Create and listen on 2567 (or PORT environment variable.)
setupOpenAIKey(process.env.OPEN_API_KEY);
setupOllama(process.env.OLLAMA_MODEL,0.7,process.env.OLLAMA_BASE_URL);
setupReplicateKey(process.env.REPLICATE_API_TOKEN);
setupInpaintUrl(process.env.INPAINT_URL);
setOSVoiceGeneration(true);
listen(appConfig, Number(process.env.PORT) || 3029);
setTimeout(async ()=>{
    setMainChain(await createRagChain(modelTypes.openAI,{src:"src/llms/data/mrt.txt",type:'txt'}));
},10);