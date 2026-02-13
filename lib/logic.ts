
export async function syncWithAccounting(expenseData: any) {
    return { success: true, transactionId: `TRX-${Math.floor(Math.random() * 10000)}` };
}

const seenReceipts: string[] = [];

export function detectFraud(expenseData: any) {
    const receiptSignature = `${expenseData.merchant}-${expenseData.date}-${expenseData.total}`;

    if (seenReceipts.includes(receiptSignature)) {
        return { isFlagged: true, reason: "Duplicate receipt detected" };
    }

    seenReceipts.push(receiptSignature);
    return { isFlagged: false, reason: "No anomalies detected" };
}

export function routeApproval(decision: any, amount: number) {
    if (decision.decision === "Approve" && amount < 800) {
        return { status: "Auto-Approved", approver: "System" };
    }

    return { status: "Needs Manager Approval", approver: "Line Manager" };
}
