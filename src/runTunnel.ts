import ngrok from "ngrok";
import dotenv from "dotenv";

dotenv.config();
const startTunnel = async (port: number) => {
    try {
        const connect = await ngrok.connect(port);
        console.log("Tunnel is running at: " + connect);
    } catch (error) {
        console.error("Error connecting to tunnel", error);
        process.exit(1);
    }
};

startTunnel(parseInt(process.env.PORT!));
