import {userState} from 'react';

function SipPlanner() {
    const [formData, setFormData] = useState({
        amount: '',
        returnRate: '',
        months: '',
    });
    
    const [result, setResult] = useState(null);
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const calculateSip = (e) => {
        e.preventDefault();

        const monthlyInvestment = parseFloat(formData.amount);
        const annualReturnRate = parseFloat(formData.returnRate) / 100;
        const totalMonths = parseInt(formData.months);

        // Calculation

        const monthlyRate = (annualReturnRate / 12) / 100;
        corpus = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
        const totalInvestment = monthlyInvestment * totalMonths;
        const totalEarnings = corpus - totalInvestment;

        // Calculate end date
        const currentDate = new Date();
        const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + totalMonths));
        const formattedEndDate = endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });



        setResult({
            totalInvested: totalInvestment,
            projectedCorpus: corpus,
            totalEarnings: totalEarnings,
            endDate: formattedEndDate,
        });
    };

        return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">SIP Planner</h1>
      <p className="text-gray-500 mb-6">Plan your SIP with a fixed number of instalments.</p>

      <form onSubmit={calculateSIP} className="bg-gray-50 p-6 rounded-lg shadow-md mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monthly SIP Amount (₹)</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., 10000" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Annual Return (%)</label>
          <input type="number" step="0.1" name="returnRate" value={formData.returnRate} onChange={handleInputChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Instalments (Months)</label>
          <input type="number" name="months" value={formData.months} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., 36" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Calculate Projection
        </button>
      </form>

{/* RESULT BOX */}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4">Projection Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Total Invested</p>
              <p className="text-2xl font-bold">₹{result.totalInvested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Projected Corpus</p>
              <p className="text-2xl font-bold text-green-600">₹{result.projectedCorpus.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-600">₹{result.totalEarnings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">End Date</p>
              <p className="text-2xl font-bold">{result.endDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SipPlanner;