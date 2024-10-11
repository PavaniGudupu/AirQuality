// app.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { param } = require('express/lib/request');


const app = express();
const API_KEY = "96f90e1a-64a4-4c8a-99de-0d4e187d3ab5";
const API_URL = "http://api.airvisual.com/v2/";


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("index.ejs", { content: "Waiting for data..." });
  });


//   GET List supported countries
app.post('/getCountry', async(req, res)=>{
    try{
        const request = await axios.get(API_URL + 'countries', {
            params: {
                key: API_KEY, 
            },
    })
    const response = request.data;
    console.log(response);
    res.render('data.ejs', {content: JSON.stringify(response)});
    } catch(error) {
        res.status(404).send(error.message);
    }
})


//GET List supported states in a country
app.post('/getState', async(req, res) => {
    const countryName = req.body.country;
    try{ 
        const request = await axios.get(API_URL + 'states', {
            params: {
                country: countryName,
                key: API_KEY
            }
        })
        const response = request.data;
        console.log(response);
        res.render('data.ejs', {content: JSON.stringify(response)});
    } catch(error) {
        res.status(404).send(error.message);
    }
})


// GET List supported cities in a state
app.post('/getCities', async(req, res) => {
    const stateName = req.body.state;
    const countryName = req.body.country;
    try{
        const request = await axios.get(API_URL + 'cities', {
            params: {
                state: stateName,
                country: countryName,
                key: API_KEY
            }
        })
        const response = request.data;
        console.log(response);
        res.render('data.ejs', {content: JSON.stringify(response)});
    } catch(error) {
        res.status(404).send(error.message);
    }
})


app.post('/getCity', async(req, res) => {
    const stateName = req.body.state;
    const countryName = req.body.country;
    const cityName = req.body.city;
    try {
        console.log(`Requesting city data for: Country - ${countryName}, State - ${stateName}, City - ${cityName}`);
        const request = await axios.get(API_URL + 'city', {
            params: {
                city: cityName,
                state: stateName,
                country: countryName,
                key: API_KEY
            }
        });
        const response = request.data;
        console.log('API Response:', response);
        res.render('data.ejs', {content: JSON.stringify(response)});
    } catch(error) {
        console.error('Error fetching city data:', error.response ? error.response.data : error.message);
        res.status(404).send(error.message);
    }
});



// Get nearest city data (IP geolocation)
app.post('/getNearestCity', async(req, res) => {
    try {
        const request = await axios.get(API_URL + 'nearest_city', {
            params: {
                key: API_KEY
            }
        });
        const response = request.data;
        if (response.status === "success") {
            res.render('data.ejs', {content: JSON.stringify(response)});
        } else {
            res.status(400).send('Error: API returned an unsuccessful status');
        }
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});


// Get nearest city data (GPS coordinates)
app.post("/getGPSCity", async (req, res) => {
    const latitude = req.body.lat;
    const longitude = req.body.lon;
    try {
        const request = await axios.get(API_URL + 'nearest_city', {
            params: {
                lat: latitude,
                lon: longitude,
                key: API_KEY
            }
        });
        const response = request.data;  // Use request.data instead of request.body
        console.log(response);
        res.render('data.ejs', { content: JSON.stringify(response) });
    } catch (error) {
        res.status(404).send(error.message);
    }
});




app.listen(3000, () => {
    console.log('Server running on port 3000');
});

