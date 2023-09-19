export default function computeFieldName(newRow, oldRow) {
    if (newRow.name !== oldRow.name) {
        return `name`;
    }
    if (newRow.surname !== oldRow.surname) {
        return `surname`;
    }
    if (newRow.role !== oldRow.role) {
        return `role`;
    }
    if (newRow.bankAccount !== oldRow.bankAccount) {
        return `bankAccount`;
    }
    if (newRow.salary !== oldRow.salary) {
        return `salary`;
    }
    if (newRow.city !== oldRow.city) {
        return `city`;
    }
    if (newRow.state !== oldRow.state) {
        return `state`;
    }
    if (newRow.street !== oldRow.street) {
        return `street`;
    }
    if (newRow.zipCode !== oldRow.zipCode) {
        return `zipCode`;
    }
    return null;
}
