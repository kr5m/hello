function searchPostalCode() {
    event.preventDefault(); //prevents the form from doing default submissions on load
    const postalcode = document.getElementById("newpostcode").value.trim();
    const unit = document.getElementById('unitNumbers').value.trim();// Unitnumber input box was retrieved
    console.log(postalcode)
    if (!postalcode || postalcode.length !== 6 || !/^\d{6}$/.test(postalcode)) {
        alert("Please enter a valid 6-digit postal code");
        return;
    }

    /*this is the SLA api that is being called where the postal code typed by the user 
    is sent to the SLA's server via the params*/
    fetch(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5OTQ4LCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiT25lTWFwIiwiaWF0IjoxNzYyNDQwODI3LCJuYmYiOjE3NjI0NDA4MjcsImV4cCI6MTc2MjcwMDAyNywianRpIjoiNDcyZWQyZmEtODg3OS00ZjczLWI5NGQtOTRiNTcxMTQ0N2M2In0.JqOcJTrQsTj1S4luZhiW9QhOVw8xWSv76PK4myTu2vPuHoeXR7aI9sPQOw2mzGVAcRjcwezumSttkWjLsYUvu16dICn0CDQZlynk8QLLKBdeWiah9bNH-twEMftaFHWEQnUeQmIdHqfXhMil_sBidfr1jh5-MWc-XeYD1cUWj7aiD1D9Kw7OQnjLeB4PUJrBdgD8TBP2MgLO_AWOJuQuZC24pPexlfcrFzB2JC_StsdZ0HO_3uu7WofVYby5Eet5WC8DXQK0ATtb20PhnWdUmVSC7G1PSfOWs5vk1tR-Uc9nsJ2v6MPK_VDQlKqdNrPjvwN9Tmxbt3fE--rkIoGMtQ'
        }
    })
        .then(response => response.json())//converting the response from the backend from raw response to json response
        .then(data => { //accessing the data returned by the backend
            if (data.results && data.results.length > 0) { //ensures that there is data returned
                const fulladdress = document.getElementById('fulladdress') // fulladdres input box was retrieved
                if (unit.value != "") {
                    fulladdress.innerHTML = `<br>Unit Number: #${unit}, Street Address: ${data.results[0].ADDRESS}` //Full complete address has been printed out in the fulladdress div tag
                } else {
                    fulladdress.innerHTML = `<br>${data.results[0].ADDRESS}`//Full complete address has been printed out in the fulladdress div tag
                }
                addressResult.style.color = 'green';
            } else {
                alert("No address found for that postal code.") //will show if postal code is invalid
            }
        })
        .catch(err => console.error(err)) //shown in console if the whole thing 
}