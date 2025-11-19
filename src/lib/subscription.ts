export interface Subscription {
    name: string;
    cost: number;
    cycle: string;
    currency: string;
    startDate: Date;
    image?: string;
}

export function normalizeDate(d: Date) {
    const normalized = new Date(d);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

export function getSubscriptions(date: Date, subs: Subscription[]): Subscription[] {
    const normalizedDate = normalizeDate(date);

    // 找到在該日期或之前開始的訂閱，且該日期是該訂閱的扣款日
    const activeSubs = subs.filter((sub) => {
        const startDate = new Date(sub.startDate);
        if (isNaN(startDate.getTime())) return false;

        const normalizedStartDate = normalizeDate(startDate);
        const isAfterStartDate = normalizedDate >= normalizedStartDate;

        // 根據訂閱週期判斷是否為扣款日
        let isBillingDay = false;
        if (sub.cycle === "月") {
            // 每月訂閱：每月的同一天
            isBillingDay = date.getDate() === startDate.getDate();
        } else if (sub.cycle === "年") {
            // 每年訂閱：每年的同月同日
            isBillingDay =
                date.getDate() === startDate.getDate() &&
                date.getMonth() === startDate.getMonth();
        }

        return isAfterStartDate && isBillingDay;
    });

    return activeSubs;
}

export function calculateTotalCost(subs: Subscription[], selectedSubs: Set<string>): number {
    // 換算成台幣，1 USD = 30 TWD
    const exchangeRate = 30; // 1 USD = 30 TWD

    const totalTWD = subs.reduce((total, sub) => {
        // 只計算被選中的訂閱
        if (!selectedSubs.has(sub.name)) return total;

        let monthlyCost = sub.cost;

        // 將年度訂閱換算成每月成本
        if (sub.cycle === "年") {
            monthlyCost = sub.cost / 12;
        }

        if (sub.currency === "USD") {
            return total + monthlyCost * exchangeRate;
        } else if (sub.currency === "TWD") {
            return total + monthlyCost;
        }
        return total;
    }, 0);

    return Math.round(totalTWD);
}
