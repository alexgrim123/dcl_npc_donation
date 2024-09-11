// For Node.js, uncomment the following line
const Colyseus = require('colyseus.js');

// Connect to the Colyseus server


export const connectToRoom = async () => {
    const client = new Colyseus.Client(`ws://localhost:${Number(process.env.PORT)}`);
    console.log("client", client)
    // Join the default room
    client.joinOrCreate("lobby_room").then((room: {
        id: any;
        onMessage: any;
        send: any;
        onStateChange: any;
    }) => {
        console.log("Joined room:", room.id);

        // Listen for messages from the server
        room.onMessage((message: any) => {
            console.log("Message received from server:", message);
        });

        // Send a message to the server
        room.send({action: 'say_hello'});

        // Handle room state changes
        room.onStateChange.once((state: any) => {
            console.log("Initial room state:", state);
        });

        room.onStateChange((state: any) => {
            console.log("New room state:", state);
        });

    }).catch((e: any) => {
        console.error("Join room failed:", e);
    });


}
