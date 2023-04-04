import React, {useEffect, useState} from 'react';
import Stat from "./Stat";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import calculateQuotesStatValues, {Quote} from "./math";
import Spinner from "./Spinner";

export const API_URL = 'http://localhost:8080';
const WEBSOCKET_URL = 'wss://trade.termplat.com:8800/?password=1234';

function App() {
    const [countQuotes, setCountQuotes] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [requests, setRequests] = useState(0);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
    const {readyState, lastJsonMessage, getWebSocket} = useWebSocket<{ id: number; value: number } | null>(wsUrl);

    useEffect(() => {
        if (lastJsonMessage) {
            setAllQuotes((prev) => prev.concat({
                id: lastJsonMessage.id,
                value: lastJsonMessage.value,
                date: new Date(),
            }))
        }
    }, [lastJsonMessage])

    useEffect(() => {
        if (countQuotes && allQuotes.length % countQuotes === 0) {
            sendStat();
        }
    }, [allQuotes]);

    const onChangeQuotes = (value: string) => {
        const intValue = parseInt(value);
        setCountQuotes(intValue > 0 ? intValue : 0);
    }

    const onClickStart = () => {
        if (countQuotes <= 0) {
            return;
        }

        setWsUrl(WEBSOCKET_URL);
        setIsRunning(true);
    }

    const sendStat = async () => {
        const startDate = new Date();
        const start = performance.now();
        const stat = calculateQuotesStatValues(allQuotes);
        const calculateTime = (performance.now() - start) / 1000;
        const data = {
            ...stat,
            calculateStartedAt: startDate.getTime() / 1000,
            calculateTime,
            countQuotes: allQuotes.length,
        };

        try {
            setRequests((prevState => prevState + 1));

            await fetch(API_URL + '/quotes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });

            console.log('Request', data);
        } catch (e) {
            setWsUrl(null);
            alert('Request error: ' + e + "\nPlease fix api service and reload page");
        }
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Running',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Set count rows',
    }[readyState];

    return (
        <div className={'App'}>
            <div className={'row'}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '.5rem',
                }}>
                    {isRunning && (
                        <>
                            <p>Websocket Status: <strong>{connectionStatus}</strong>&nbsp;&nbsp;&nbsp;{readyState === ReadyState.OPEN && <Spinner/>}</p>
                            <p>Requests: <strong>{requests}</strong></p>
                        </>
                    )}
                    <label>Кількість котирувань: {isRunning && <>{countQuotes}</>}</label>
                    {!isRunning && (
                        <>
                            <input value={countQuotes} onChange={(event) => onChangeQuotes(event.currentTarget.value)}/>
                            <button onClick={onClickStart} className={'button'} disabled={countQuotes <= 0}>Старт
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className={'row'}>
                <Stat/>
            </div>
        </div>
    )
}

export default App;


