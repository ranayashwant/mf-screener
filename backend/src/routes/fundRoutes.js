// backend/src/routes/fundRoutes.js
import express from 'express';

const router = express.Router();

// --- FUND SCREENER ROUTE ---
router.get('/api/funds', async (req, res) => {
  try {
    const response = await fetch('https://api.mfapi.in/mf');         
    const data = await response.json();

    const directFunds = data.filter(scheme =>
      scheme.schemeName.includes("Direct")
    );

    const allScheme = directFunds.map(scheme => ({
      code: scheme.schemeCode,
      name: scheme.schemeName
    }));

    let FinalFund;

    if(req.query.search){
       FinalFund = allScheme.filter
        (scheme => scheme.name.toLowerCase().includes(req.query.search.toLocaleLowerCase())
        );
    } else {
      FinalFund = allScheme;
    }
    
    console.log("Search:", req.query.search);
    res.json(FinalFund);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// --- FUND DETAIL ROUTE ---
router.get('/api/funds/:schemeCode', async (req, res) => {    
  try {
    const code = req.params.schemeCode;
    const response = await fetch('https://api.mfapi.in/mf/' + code); 
    const data = await response.json();

    if (data.data.length === 0) {
      return res.status(404).json({ error: 'Fund not found or invalid scheme code' });
    }
  
    res.json(data);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the mini-app
export default router;