import {useState, useEffect} from 'react';

function App() {
  //state variables
  const[allFunds, setAllFunds] = useState([]); // empty array to store fetched funds
  const [searchTerm, setSearchTerm] = useState(''); 
  const [loading, setLoading] = useState(true); //to show "loading..."


//fetch funds from backend server (runs one time)
  useEffect(() => {
    async function fetchFunds() {
      try {
        

        

        //backend is called for MFAPI data
        const response = await fetch('http://localhost:3000/api/funds');
        const data = await response.json();
         setAllFunds(data); // Save the big list here
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch :', error);
        setLoading(false);
        
      }
    }
    fetchFunds();
  }, []);    //empty array means run only once when component mounts

  //for filtering from the fetched funds according to search term
  const filteredFunds = allFunds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    //if loading is true, show loading message
  if (loading) return <div className="p-8 text-xl">Loading funds...</div>;

    return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mutual Funds Screener</h1>
       
       {/*search input field to set searchTerm state variable*/}
       <input type="text"
       placeholder="Search by fund name"
       className = "w-full p-3 border rounded-md shadow-sm mb-6 focus:outline-none focus:ring-3 focus:ring-blue-500"
        value={searchTerm}

        onChange={(e) => setSearchTerm(e.target.value)}
       />

        <p className="text-sm text-gray-500 mb-4">Showing {filteredFunds.length} of {allFunds.length} funds</p>

        {/*mapping acquired funds according to name and code */}
      <div className="grid gap-4:">
        {filteredFunds.map(fund => (
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