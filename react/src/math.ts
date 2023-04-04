export default function calculateQuotesStatValues(data: Quote[]): StatValues {
    const values = data.map(item => item.value);
    const sumValues = values.reduce((a, b) => a + b, 0);
    const countItems = values.length;
    const mean = sumValues / countItems;
    const std = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / countItems);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mode = calculateMode(values);
    let countMissed = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i + 1]) {
            countMissed += Math.abs(data[i + 1].id - data[i].id) - 1;
        }
    }

    return {
        mean,
        std,
        mode,
        min,
        max,
        countMissed,
    }
}

function calculateMode(data: number[]) {
    const mode: Record<number, number> = {};
    let max = 0, count = 0;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (mode[item]) {
            mode[item]++;
        } else {
            mode[item] = 1;
        }

        if (count < mode[item]) {
            max = item;
            count = mode[item];
        }
    }

    return max;
}

interface StatValues {
    mean: number,
    std: number,
    mode: number,
    min: number,
    max: number,
    countMissed: number,
}

export interface Quote {
    id: number;
    value: number;
    date: Date;
}
