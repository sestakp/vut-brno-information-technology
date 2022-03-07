export default interface Notification {
    message: string,
    status: "FAIL" | "SUCCESS" | "WARNING" | "",
    show: boolean
}