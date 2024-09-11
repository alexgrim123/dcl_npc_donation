README


## API/Local Models

- OpenAI API, Claude2 API. Both are used for text generation, voice generation and image generation. Just add API Key
- Local Models with Ollama:

Install Ollama with the following command:
```
curl -fsSL https://ollama.com/install.sh | sh
```

Then run the following command to start the local models:

Llama 3 (for servers with GPU):
```
ollama run llama3
```

Phi-3 (for CPU servers)
```
ollama run phi3
```

For ollama add endpoint: 


## Local Stable Diffusion Models


[Install](https://github.com/AUTOMATIC1111/stable-diffusion-webui?tab=readme-ov-file#installation-and-running) sd-webui according your machine's OS

run with -api flag to enable API

Use the function: 


## Local Voice Generation Models

Use the function: 


## Local Voice Generation Models

Use the function:


## NPCs with AI implementation

There are 2 of them, they are created with createNpc() method in index.ts
One of them is non-configured, another is configured. It affects backend system message handling,
configured NPC will use predetermined backend config object to specify system message

CreateNpc() has transform and npc configuration object (like in basic dcl-npc-toolkit)
Then it has ragModel, configuredMode, endpoint, room name and file server url

Can be changed as parameteres
- ragModel uses rag model generation (which is handled on backend, mostly inside the backend library)
- configureModel specifies backend to use configuration Role-play Characters. Won't work with rag model. Configured in globals.ts
- endpoint is a url for server connection

Can be changed inside the function
- room name is the room name from colyseus server which this project connects to
- file server url is optional, if specified, voice and image files will be fetched from it and not from server url directly

## Banner image generation

Created with new CustomPainting(). Creates a banner painting, clicking it opens up input UI.
Fill in a prompt and click ok to send prompt to backend for further image generation
Connection.ts has a handler to display received image url into the banner painting

## Music boombox generation

created with new MusicBoombox(). Creates a boombox, clicking it opens up input UI.
Fill in a prompt and click ok to send prompt to backend for further music generation
Connection.ts has a handler to turn on received music url once

## Server

index file has following specific init functions:

Setting openAI key (needed for using openAI llm and for generating images)
```ts
setupOpenAIKey(process.env.OPEN_API_KEY);
```

Setting Replicate key for music generation
```ts
setupReplicateKey(process.env.REPLICATE_API_TOKEN);
```

Creating rag chain (ollama can be changed to openAI if needed, then setting openAI key is needed as described above)
```ts
setTimeout(async ()=>{
    setMainChain(await createRagChain(modelTypes.ollama,{src:"./src/llms/data/mrt.txt",type:'txt'}));
},10);
```

MainRoom has listeners, getImage and getMusic are used for corresponding generations, getAnswer is used to text queries
getAnswer need to send back getAnswer, because it is received by frontend npc library
msg.rag and msg.configured are bools for deciding on using rag chain and on using config (found in global.ts) or not
