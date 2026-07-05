  //profite and loss calculator
  
  const calculatePnL = (units, purchaseNav, currentNav) => {
    const investedAmount = units * purchaseNav;
    const currentValue = units * currentNav;
    const gain = currentValue - investedAmount;
    const gainPercentage = (gain / investedAmount) * 100;
    
    return {
        investedAmount,
        currentValue,      
        gain,
        gainPercentage
    };
}
