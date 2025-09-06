export function setupWebSocket(url, app) {
    const socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    socket.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.type === "system" && !d.message.bStatus) {
            document.querySelector('.counter').classList.remove('hidden');
            document.querySelector('.red-hot-line-timer-layer').style.display = 'none';
        }
    };

    function broadcastMessage(msg) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msg));
        }
    }

    return { socket, broadcastMessage };
}
