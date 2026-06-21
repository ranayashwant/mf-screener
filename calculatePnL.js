const calculatePnL = (units, purchaseNav, currentNav) => {
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

const funds = [
  { name: "SBI Bluechip", category: "equity", return1y: 18.5, risk: "high" },
  { name: "HDFC Short Term", category: "debt", return1y: 7.2, risk: "low" },
  { name: "Axis Mid Cap", category: "equity", return1y: 22.1, risk: "high" },
  { name: "ICICI Balanced", category: "hybrid", return1y: 12.3, risk: "moderate" },
  { name: "Kotak Liquid", category: "debt", return1y: 6.5, risk: "low" },
  { name: "Mirae Large Cap", category: "equity", return1y: 19.8, risk: "high" },]

  const equityfunds = funds.filter(funds => funds.category === "equity")
  .map(funds => funds.name);
  console.log(equityfunds);