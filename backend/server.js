import express from 'express';

const app = express();
const PORT = 3000;

// this is called "Middleware" - it allows your server to read JSON data
app.use(express.json());

//very first API route!
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'MF Screener API is running' 
  });
});

//for fetching and sorting/maping funds
app.get('/api/funds', async (req, res) =>{
  try{
    // adding temp data for testing
   /* const data = [
      { schemeCode: 100033, schemeName: "SBI Bluechip Fund - Direct - Growth" },
      { schemeCode: 119551, schemeName: "Parag Parikh Flexi Cap Fund - Direct - Growth" },
      { schemeCode: 120503, schemeName: "SBI Small Cap Fund - Direct - Growth" },
      { schemeCode: 102345, schemeName: "HDFC Mid-Cap Opportunities Fund - Direct - Growth" },
      { schemeCode: 112345, schemeName: "Axis Long Term Equity Fund - Direct - Growth" }
    ];
*/

  const response = await fetch('https://api.mfapi.in/mf');         // <== api fetch code
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
        
    }
    else {
    FinalFund = allScheme;
    
  }
    console.log("Search:", req.query.search);
    res.json(FinalFund);
  }

  catch(error){
  res.status(500).json(
    {error: error.message});
  }
}
);

app.get('/api/funds/:schemeCode',async (req, res) => {    //second route to search by fund code in url
  const code = req.params.schemeCode;

  const response = await fetch('https://api.mfapi.in/mf/' + code); 
  const data = await response.json();

  res.json(data);
} );

// this starts the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});