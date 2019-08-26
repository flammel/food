export function dateToString(date: Date): string {
    return (
        date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).substr(-2) + "-" + ("0" + date.getDate()).substr(-2)
    );
}
