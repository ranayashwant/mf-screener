function calculatePnL(units, purchaseNav, currentNav) {
    const investedAmount = units * purchaseNav;
    const currentValue = units * currentNav;
    const gain = currentValue - investedAmount;
    const gainPercentage = (gain / investedAmount) * 100;
    
    return {
        investedAmount: investedAmount.toFixed(2),
        currentValue: currentValue.toFixed(2),
        gain: gain.toFixed(2),
        gainPercentage: gainPercentage.toFixed(2) + '%'
    };
}