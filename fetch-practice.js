async function getcleanFunds() {
    try{
        const response = await fetch('https://api.mfapi.in/mf');
        const data = await response.json();
       
        const allScheme = data.map(scheme => ({
            code: scheme.schemeCode,
            name: scheme.schemeName
        })) ;

 const directFunds = allScheme.filter
        (scheme => scheme.name.includes("Direct")
        );

        const sortedDirectFundByName = directFunds.sort(
           (a,b) => a.name.localeCompare(b.name)
    );
        
    const top5Funds = sortedDirectFundByName.slice(0,5);
        console.table(top5Funds);
    }

    
    catch(error) {
        console.error(error);
    }
}

getcleanFunds();


     
