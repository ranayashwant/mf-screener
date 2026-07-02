// frontend/src/pages/Portfolio.jsx
import { useState, useEffect } from 'react';
//import { getApiUrl } from '../api';

function Portfolio() {    // state for the list of holdings
  const [holdings, setHoldings] = useState([]);
  
  
  const [formData, setFormData] = useState({    // state for the form inputs
    scheme_code: '',
    units: '',
    purchase_nav: '',
    purchase_date: '',
    Folio_Number: ''
  });

  // Fetch existing holdings when page loads
  useEffect(() => {
    async function fetchHoldingsWithPnL() {
      try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`);
      const rawHoldings = await response.json();

      if(rawHoldings.length === 0 ) {
        setHoldings([]);
        return;
      }
      const navPromises = rawHoldings.map(holding => 
  fetch(`${import.meta.env.VITE_API_URL}/api/funds/${holding.scheme_code}`)
    .then(res => res.json())
    .then(fundData => {
      if (!fundData.data || fundData.data.length === 0) return null;
      return parseFloat(fundData.data[0].nav);
    })
);
      const holdingsData = await Promise.all(navPromises);
      const finalHoldings = holdingsData.map(h => {
        const investedAmount = h.units * h.purchase_nav;
        const currentValue = h.units * h.currentNav;
        const gain = currentValue - investedAmount;
        const gainPercent = (gain / investedAmount) * 100;
        return {
          ...h,
          investedAmount: investedAmount.toFixed(2),
          currentValue: currentValue.toFixed(2),
          gain: gain.toFixed(2),
          gainPercent: gainPercent.toFixed(2)
        };
      });
      setHoldings(finalHoldings);
    }
    
      catch (error) {
        console.error("Failed to calculate P&L (MFAPI might be down):", error);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/...`);
        const rawHoldings = await response.json();
        setHoldings(rawHoldings);
      }
    }
    fetchHoldingsWithPnL();
   []});

  // 3. Handle typing in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target; // 'name' comes from the name="" attribute on the input
    setFormData({
      ...formData, // keep existing form data
      [name]: value // update ONLY the field that was typed in
    });
  };

  // 4. Handle clicking "Add Holding"
  const handleSubmit = async (e) => {
    e.preventDefault(); // STOP the browser from refreshing the page (default HTML behavior)

    // Send POST request to backend
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // Convert JS object to JSON string
    });

    if (response.ok) {
      // Clear form
      setFormData({ scheme_code: '', units: '', purchase_nav: '', purchase_date: '' });
      
      // Re-fetch holdings to show the new one
      const updatedData = await fetch(`${import.meta.env.VITE_API_URL}/api/...`);
      setHoldings(await updatedData.json());
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Portfolio Tracker</h1>

      {/* --- ADD HOLDING FORM --- */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md mb-8 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Scheme Code</label>
          <input 
            type="text" 
            name="scheme_code" 
            value={formData.scheme_code} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"
            placeholder="e.g., 100033"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Units</label>
          <input 
            type="number" 
            step="0.001"
            name="units" 
            value={formData.units} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"
            placeholder="e.g., 150.25"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Purchase NAV</label>
          <input 
            type="number" 
            step="0.0001"
            name="purchase_nav" 
            value={formData.purchase_nav} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"
            placeholder="e.g., 45.5000"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Folio Number</label>
          <input 
            type="text" 
            name="Folio_Number" 
            value={formData.Folio_Number} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Purchase Date</label>
          <input 
            type="date" 
            name="purchase_date" 
            value={formData.purchase_date} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"
            required 
          />
        </div>

        
        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Add Holding
          </button>
        </div>
      </form>

      {/* --- HOLDINGS TABLE --- */}
      <h2 className="text-xl font-semibold mb-4">Your Holdings</h2>
      {holdings.length === 0 ? (
        <p className="text-gray-500">No holdings added yet.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              
              <th className="p-3 border text-left">Scheme Code</th>
              <th className="p-3 border text-right">Units</th>
              <th className="p-3 border text-right">Purchase NAV</th>
              <th className="p-3 border text-right">Current NAV</th>
              <th className="p-3 border text-right">Invested</th>
              <th className="p-3 border text-right">Current Value</th>
              <th className="p-3 border text-right">P&L</th>
             
            </tr>
          </thead>
          <tbody>
                        {holdings.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50">
                <td className="p-3 border font-mono">{h.scheme_code}</td>
                <td className="p-3 border text-right">{h.units}</td>
                <td className="p-3 border text-right">₹{h.purchase_nav}</td>
                <td className="p-3 border text-right font-semibold">₹{h.currentNav}</td>
                <td className="p-3 border text-right">₹{h.investedAmount}</td>
                <td className="p-3 border text-right">₹{h.currentValue}</td>
                <td className={`p-3 border text-right font-bold ${h.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{h.gain} ({h.gainPercent}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Portfolio;