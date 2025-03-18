import { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import styles from '../styles/Home.module.css';
export default function Home() {
    const [trades, setTrades] = useState([]);
    const [balance, setBalance] = useState(0);
    const { lastMessage } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || '');
    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage);
            if (data.type === 'TRADE') {
                setTrades(prev => [data.trade, ...prev].slice(0, 50));
            }
            else if (data.type === 'BALANCE') {
                setBalance(data.balance);
            }
        }
    }, [lastMessage]);
    return (<div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>자동 주식 거래 시스템</h1>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>계좌 잔고</h2>
            <p className={styles.balance}>{balance.toLocaleString()}원</p>
          </div>

          <div className={styles.card}>
            <h2>실시간 거래 내역</h2>
            <div className={styles.tradeList}>
              {trades.map((trade, index) => (<div key={index} className={styles.tradeItem}>
                  <span className={styles.symbol}>{trade.symbol}</span>
                  <span className={styles.price}>{trade.price.toLocaleString()}원</span>
                  <span className={`${styles.change} ${trade.change >= 0 ? styles.positive : styles.negative}`}>
                    {trade.change >= 0 ? '+' : ''}{trade.change}%
                  </span>
                  <span className={styles.volume}>{trade.volume.toLocaleString()}주</span>
                  <span className={styles.time}>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                </div>))}
            </div>
          </div>
        </div>
      </main>
    </div>);
}
