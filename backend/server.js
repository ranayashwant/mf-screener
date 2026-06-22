// server.js
import express from 'express';

const app = express();
const PORT = 3000;

// This is called "Middleware" - it allows your server to read JSON data
app.use(express.json());

// Your very first API route!
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'MF Screener API is running' 
  });
});

//for fetching and sorting/maping funds
app.get('/api/funds', async (req, res) =>{
  try{
  const response = await fetch('https://api.mfapi.in/mf');
  const data = await response.json();

  const directFunds = data.filter(scheme =>
    scheme.schemeName.includes("Direct")
  );

  const allScheme = directFunds.map(scheme => ({
    code: scheme.schemeCode,
    name: scheme.schemeName
  }));

    res.json(allScheme)
  }

  catch(error){
  res.status(500).json(
    {error: error.message});
  }
}
);

// This starts the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});