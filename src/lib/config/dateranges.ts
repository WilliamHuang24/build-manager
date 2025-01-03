import { 
    type DateValue,
    CalendarDate,
    getLocalTimeZone,
    today
} from "@internationalized/date";


export const ranges = [
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "All Time"
];

export type DateRange = {
    start: DateValue,
    end: DateValue
};

export function getDateRange(choice: String) : DateRange {
    const endDate = today(getLocalTimeZone());
    
    switch (choice) {
        case "Today":
            return {start: endDate, end: endDate}

        case "This Week":
            return {start: endDate.subtract({weeks: 1}), end: endDate}
            
        case "This Month":
            return {start: endDate.subtract({months: 1}), end: endDate}

        case "This Year":
            return {start: endDate.subtract({years: 1}), end: endDate}

        case "All Time":
            return {start: new CalendarDate(2000, 1, 1), end: endDate}

        default:
            return {start: endDate, end: endDate}
    }
}


