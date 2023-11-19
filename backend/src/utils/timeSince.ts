export default function (date?: Date) {
    return (new Date().getTime() - (date?.getTime() || 0)) / 1000;
}
