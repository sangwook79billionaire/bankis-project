import { useEffect, useRef, useState } from 'react';

interface WebSocketHook {
  lastMessage: string | null;
  sendMessage: (message: string) => void;
}

export function useWebSocket(url: string): WebSocketHook {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

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

  const sendMessage = (message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return { lastMessage, sendMessage };
} 