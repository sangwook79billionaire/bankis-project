import { useEffect, useRef, useState } from 'react';
export function useWebSocket(url) {
    const [lastMessage, setLastMessage] = useState(null);
    const ws = useRef(null);
    useEffect(() => {
        ws.current = new WebSocket(url);
        ws.current.onopen = () => {
            console.log('WebSocket 연결됨');
        };
        ws.current.onmessage = (event) => {
            setLastMessage(event.data);
        };
        ws.current.onerror = (error) => {
            console.error('WebSocket 오류:', error);
        };
        ws.current.onclose = () => {
            console.log('WebSocket 연결 종료');
        };
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);
    const sendMessage = (message) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(message);
        }
    };
    return { lastMessage, sendMessage };
}
