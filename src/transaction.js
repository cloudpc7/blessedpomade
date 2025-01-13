export const transactionId = () => {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 9);
    return `txn_${timestamp}_${randomPart}`;
};
