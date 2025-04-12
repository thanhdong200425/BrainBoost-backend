import ngrok from "ngrok";
import dotenv from "dotenv";

dotenv.config();

const startTunnel = async (port: number) => {
    try {
        // Configure ngrok with more options
        const connect = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTH_TOKEN,
            region: "ap",
            onStatusChange: (status) => console.log("Ngrok status:", status),
            onLogEvent: (data) => console.log("Ngrok log:", data),
        });
        console.log("Tunnel is running at: " + connect);
    } catch (error) {
        console.error("Error connecting to tunnel", error);
        // Don't exit the process, just log the error
        console.log("Continuing without tunnel...");
    }
};

startTunnel(parseInt(process.env.PORT!));
