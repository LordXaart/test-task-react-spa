import {useState} from "react";
import {API_URL} from "./App";
import Spinner from "./Spinner";

function Stat() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<StatItem[]>([]);

    const onClickStat = async () => {
        await fetchData();
    }

    const fetchData = async () => {
        try {
            setLoading(true);

            const data = await (await fetch(API_URL + '/quotes?limit=10')).json();
            setData(data);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <button onClick={onClickStat} className={'button'} style={{marginBottom: '.5rem', width: 'auto'}}>Статистика</button>
            {loading && <Spinner/>}
            { (!loading && data.length > 0) && (
                <table className={'stat-table'} key={'table'}>
                    <thead>
                    <tr>
                        <td>Дата</td>
                        <td>Кількість записів</td>
                        <td>Мін.</td>
                        <td>Макс.</td>
                        <td>Мода</td>
                        <td>Середнє</td>
                        <td>Відхилення</td>
                        <td>Пропущені</td>
                        <td>Обчислення</td>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.created_at}</td>
                            <td>{item.count_quotes}</td>
                            <td>{item.min}</td>
                            <td>{item.max}</td>
                            <td>{item.mode}</td>
                            <td>{item.mean}</td>
                            <td>{item.std}</td>
                            <td>{item.count_missed}</td>
                            <td>{item.calculate_time.toFixed(4)} сек</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Stat;

interface StatItem {
    id: string;
    min: number;
    max: number;
    mode: number;
    mean: number;
    std: number;
    count_missed: number;
    count_quotes: number;
    calculate_time: number;
    calculate_started_at: string;
    created_at: string;
}
