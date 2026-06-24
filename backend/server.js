import express from 'express';
import pool from './src/db/connection.js';

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
  try{
  const code = req.params.schemeCode;

  const response = await fetch('https://api.mfapi.in/mf/' + code); 
  const data = await response.json();

  if (data.data.length === 0) {
      return res.status(404).json({ 
        error: 'Fund not found or invalid scheme code' });
    }

  
  res.json(data);

}
catch(error){
  res.status(500).json({error : error.message});
  }
} );

app.get('/api/portfolio', async (req, res) => {
  try{
    const [rows] = await pool.query('SELECT * FROM portfolio_holdings where user_id = 1');

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const { scheme_code, units, purchase_nav, purchase_date } = req.body;  //user send data in body extraction
    const sql = 
        `
      INSERT INTO portfolio_holdings (user_id, scheme_code, units, purchase_nav, purchase_date)
      VALUES (1, ?, ?, ?, ?)
    `;
    await pool.execute(sql, [scheme_code, units, purchase_nav, purchase_date]);
    res.status(201).json({ message: 'Holding added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try{
      const holdingId = req.params.id;
      const sql = 'DELETE FROM portfolio_holdings WHERE id = ? AND user_id = 1';
      const [result] = await pool.execute(sql, [holdingId]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Holding not found' });
      }

      res.json({ message: 'Holding deleted successfully' });
  }
  catch(error){
      res.status(500).json({ error: error.message });
  }
});


// this starts the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});