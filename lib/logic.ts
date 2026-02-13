
// Simulate integration with accounting software (e.g., QuickBooks, Xero)
export async function syncWithAccounting(expenseData: any) {
    console.log("Syncing with Accounting Software...", expenseData);
    // In a real app, this would call an external API
    return { success: true, transactionId: `TRX-${Math.floor(Math.random() * 10000)}` };
}

const seenReceipts: string[] = [];

export function detectFraud(expenseData: any) {
    // Simple hash-like check using merchant, date, and total
    const receiptSignature = `${expenseData.merchant}-${expenseData.date}-${expenseData.total}`;

    if (seenReceipts.includes(receiptSignature)) {
        return { isFlagged: true, reason: "Duplicate receipt detected" };
    }

    seenReceipts.push(receiptSignature);
    return { isFlagged: false, reason: "No anomalies detected" };
}

export function routeApproval(decision: any, amount: number) {
    // Approval Router Agent Logic
    // If the Policy Reasoner (AI) says "Approve" AND amount is small (< 800), Auto Approve.
    // Otherwise escalate.

    if (decision.decision === "Approve" && amount < 800) {
        return { status: "Auto-Approved", approver: "System" };
    }

    return { status: "Needs Manager Approval", approver: "Line Manager" };
}
