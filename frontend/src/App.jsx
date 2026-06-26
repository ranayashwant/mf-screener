import {useState, useEffect} from 'react';

function App() {
  //state variables
  const[funds, setFunds] = useState([]); // empty array to store fetched funds
  const [loading, setLoading] = useState(true); //to show "loading..."


//fetch funds from backend server (runs one time)
  useEffect(() => {
    async function fetchFunds() {
      try {
        //backend is called for MFAPI data
        const response = await fetch('http://localhost:3000/api/funds');
        const data = await response.json();
        setFunds(data); //set the fetched funds to state => screen re-renders with new data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch :', error);
        
      }
    }
    fetchFunds();
  }, []);    //empty array means run only once when component mounts
    //if loading is true, show loading message
  if (loading) return <div className="p-8 text-xl">Loading funds...</div>;

    return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mutual Funds Screener</h1>
        {/*mapping acquired funds according to name and code */}
      <div className="grid gap-4:">
        {funds.map(fund => (
          <div 
          key ={fund.code}
          className="border p-4 rounded shadow hover : bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{fund.name}</h2>
            <p className="text-gray-500 text-sm">Code: {fund.code}</p>
      </div>
        ))}
      </div>
    </div>
  );
}

export default App;