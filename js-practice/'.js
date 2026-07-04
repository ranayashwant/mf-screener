export const calculatePnL = (units, purchaseNav, currentNav) => {
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

//Sample funds for testing some functions

const funds = [
  { name: "SBI Bluechip", category: "equity", return1y: 18.5, risk: "high" },
  { name: "HDFC Short Term", category: "debt", return1y: 7.2, risk: "low" },
  { name: "Axis Mid Cap", category: "equity", return1y: 22.1, risk: "high" },
  { name: "ICICI Balanced", category: "hybrid", return1y: 12.3, risk: "moderate" },
  { name: "Kotak Liquid", category: "debt", return1y: 6.5, risk: "low" },
  { name: "Mirae Large Cap", category: "equity", return1y: 19.8, risk: "high" },]

  //filter and map functions to get the required data

  // Function to filter equity funds and return their names and 1-year returns

  const equityfunds = (funds) => funds.filter(funds => funds.category === "equity")
  .map(funds => ({
        name : funds.name,
        return1y : funds.return1y
    }));

    // Function to filter funds with 1-year return greater than 10% and return their names and 1-year returns
    const return1ymorethan10 = (funds) => funds.filter(funds => funds.return1y > 10)
    .map(funds => ({
        name : funds.name,
        return1y : funds.return1y
    }));


    // Function to filter funds that are not high risk and return their names and 1-year returns
    const NotHighRisk =  (funds) => funds.filter(funds => funds.risk !== "high")
    .map(funds => ({
        name : funds.name,
        return1y : funds.return1y
    }));


    // Function to sort funds by 1-year return in ascending order
    const sortedfunds =(funds) => return1ymorethan10(funds).sort
    ((a,b) => a.return1y - b.return1y);

    
    // Function to sort funds by name in alphabetical order
    const sortedByName = (funds) => return1ymorethan10(funds).sort(
        (a,b) => a.name.localeCompare(b.name)
    );

    // Function to sort funds by 1-year return in descending order
    const SortedByReturn = (funds) => equityfunds(funds).sort(
        (a,b) => b.return1y - a.return1y);

        function processFunds(fundArray, callbackFunction){
           return callbackFunction(fundArray);
        }
        console.log(
          processFunds(funds,sortedByName));
    