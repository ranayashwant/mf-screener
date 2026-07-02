
import { useState } from 'react';
//import { getApiUrl } from '../api';

function Calculator() {
  const [investmentType, setInvestmentType] = useState('lumpsum');
  const [timeFrameMonths, setTimeFrameMonths] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [allocations, setAllocations] = useState([
    { schemeCode: '', percentage: '' }
  ]);

  // function to add a new empty row to allocations
  const handleAddRow = () => {
    setAllocations([...allocations, { schemeCode: '', percentage: '' }]);
    
  };

  //  function to remove a row by its index
  const handleRemoveRow = (indexToRemove) => {
    setAllocations(allocations.filter((_, i) => i !== indexToRemove));
    
  };

  // function to handle changes in a specific row
  const handleRowChange = (index, field, value) => {
    setAllocations(allocations.map((row, i) => {
      if (i === index) return { ...row, [field]: value };
      return row;
    }));
  };

  const [results, setResults] = useState(null);

  const calculateDeployment = async (e) => {
    e.preventDefault();

    const parsedTotalAmount = parseFloat(totalAmount);
    const totalPercentage = allocations.reduce((sum, row) => sum + (parseFloat(row.percentage) || 0), 0);

    if (!parsedTotalAmount || parsedTotalAmount <= 0) {
      alert('Enter a valid total amount');
      return;
    }

    if (Math.round(totalPercentage) !== 100) {
      alert('Allocations must sum up to 100%');
      return;
    }

    if ((investmentType === 'sip' || investmentType === 'hybrid') && (!timeFrameMonths || Number(timeFrameMonths) <= 0)) {
      alert('Please enter a valid time frame in months');
      return;
    }

    const validRows = allocations.filter((row) => row.schemeCode && row.percentage);
    const months = parseInt(timeFrameMonths, 10) || 1;

    try {
      const navs = await Promise.all(
        validRows.map((row) =>
          fetch(getApiUrl(`/api/funds/${row.schemeCode}`))
            .then((res) => res.json())
            .then((fundData) => {
              if (!fundData.data || fundData.data.length === 0) return null;
              return parseFloat(fundData.data[0].nav);
            })
        )
      );

      const calculatedResults = validRows.map((row, index) => {
        const percentage = parseFloat(row.percentage) || 0;
        const amountForFund = (parsedTotalAmount * percentage) / 100;
        const currentNav = navs[index];

        let lumpsumAmount = 0;
        let sipAmountPerMonth = 0;
        let lumpsumUnits = 0;
        let sipUnitsPerMonth = 0;
        let totalSipUnits = 0;

        if (investmentType === 'lumpsum' || investmentType === 'hybrid') {
          const lumpsumSplit = investmentType === 'hybrid' ? 0.5 : 1;
          lumpsumAmount = amountForFund * lumpsumSplit;
        }

        if (investmentType === 'sip' || investmentType === 'hybrid') {
          const sipSplit = investmentType === 'hybrid' ? 0.5 : 1;
          sipAmountPerMonth = (amountForFund * sipSplit) / months;
        }

        // Keep the monthly SIP amount visible even when NAV data is unavailable.
        if (!currentNav || currentNav <= 0) {
          return {
            schemeCode: row.schemeCode,
            percentage,
            lumpsumAmount: lumpsumAmount.toFixed(2),
            sipAmountPerMonth: sipAmountPerMonth.toFixed(2),
            months: investmentType === 'lumpsum' ? '-' : months,
            lumpsumUnits: 'N/A',
            sipUnitsPerMonth: 'N/A',
            totalSipUnits: 'N/A',
            status: 'NAV unavailable',
          };
        }

        if (investmentType === 'lumpsum' || investmentType === 'hybrid') {
          lumpsumUnits = lumpsumAmount / currentNav;
        }

        if (investmentType === 'sip' || investmentType === 'hybrid') {
          sipUnitsPerMonth = sipAmountPerMonth / currentNav;
          totalSipUnits = sipUnitsPerMonth * months;
        }

        return {
          schemeCode: row.schemeCode,
          percentage,
          lumpsumAmount: lumpsumAmount.toFixed(2),
          sipAmountPerMonth: sipAmountPerMonth.toFixed(2),
          months: investmentType === 'lumpsum' ? '-' : months,
          lumpsumUnits: lumpsumUnits.toFixed(4),
          sipUnitsPerMonth: sipUnitsPerMonth.toFixed(4),
          totalSipUnits: totalSipUnits.toFixed(4),
        };
      });

      setResults(calculatedResults);
    } catch (error) {
      alert('Failed to fetch NAVs. Check your scheme codes.');
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Investment Calculator</h1>
      <p className="text-gray-500 mb-6">Deploy a lumpsum across multiple funds.</p>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Total Amount to Deploy (₹)</label>
        <input 
          type="number" 
          value={totalAmount} 
          onChange={(e) => setTotalAmount(e.target.value)} 
          className="w-full p-2 border rounded"
          placeholder="e.g., 500000"
        />
      </div>

            {/* INVESTMENT TYPE TOGGLE */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Investment Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="investmentType" 
              value="lumpsum" 
              checked={investmentType === 'lumpsum'}
              onChange={(e) => setInvestmentType(e.target.value)}
            />
            <span>Lumpsum</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="investmentType" 
              value="sip" 
              checked={investmentType === 'sip'}
              onChange={(e) => setInvestmentType(e.target.value)}
            />
            <span>SIP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="investmentType" 
              value="hybrid" 
              checked={investmentType === 'hybrid'}
              onChange={(e) => setInvestmentType(e.target.value)}
            />
            <span>Hybrid (Both)</span>
          </label>
        </div>
      </div>

      {/* TIME FRAME (Only shows if SIP or Hybrid is selected) */}
      {(investmentType === 'sip' || investmentType === 'hybrid') && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Deployment Time Frame (Months)</label>
          <input 
            type="number" 
            value={timeFrameMonths} 
            onChange={(e) => setTimeFrameMonths(e.target.value)} 
            className="w-full p-2 border rounded"
            placeholder="e.g., 6"
          />
        </div>
      )}

      <h3 className="font-semibold mb-3">Fund Allocation</h3>
      {allocations.map((row, index) => (
        <div key={index} className="flex gap-4 mb-3 items-center">
          <input 
            type="text" 
            placeholder="Scheme Code (e.g., 100033)" 
            value={row.schemeCode}
            onChange={(e) => handleRowChange(index, 'schemeCode', e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input 
            type="number" 
            placeholder="%" 
            value={row.percentage}
            onChange={(e) => handleRowChange(index, 'percentage', e.target.value)}
            className="w-24 p-2 border rounded"
          />
          <button onClick={() => handleRemoveRow(index)} className="text-red-500 font-bold">X</button>
        </div>
      ))}

      <button onClick={handleAddRow} className="text-blue-600 mb-6 font-semibold">
        + Add Fund
      </button>

      <button
        type="button"
        onClick={calculateDeployment}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Calculate Deployment
      </button>

                  {results && (
        <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm overflow-x-auto">
          <h3 className="font-semibold mb-3 text-lg">
            Deployment Summary ({investmentType.charAt(0).toUpperCase() + investmentType.slice(1)} Mode)
          </h3>
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border text-left">Code</th>
                <th className="p-2 border text-right">%</th>
                {investmentType !== 'sip' && <th className="p-2 border text-right">Lumpsum (₹)</th>}
                {investmentType !== 'lumpsum' && <th className="p-2 border text-right">SIP/Month (₹)</th>}
                {investmentType !== 'lumpsum' && <th className="p-2 border text-right">Months</th>}
                {investmentType !== 'sip' && <th className="p-2 border text-right">Lumpsum Units</th>}
                {investmentType !== 'lumpsum' && <th className="p-2 border text-right">SIP Units/Mo</th>}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border font-mono">{row.schemeCode}</td>
                  <td className="p-2 border text-right">{row.percentage}%</td>
                  {investmentType !== 'sip' && <td className="p-2 border text-right">₹{parseFloat(row.lumpsumAmount).toLocaleString()}</td>}
                  {investmentType !== 'lumpsum' && <td className="p-2 border text-right font-semibold text-blue-600">₹{parseFloat(row.sipAmountPerMonth).toLocaleString()}</td>}
                  {investmentType !== 'lumpsum' && <td className="p-2 border text-right">{row.months}</td>}
                  {investmentType !== 'sip' && <td className="p-2 border text-right">{row.lumpsumUnits}</td>}
                  {investmentType !== 'lumpsum' && <td className="p-2 border text-right text-green-600">{row.sipUnitsPerMonth}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Calculator;