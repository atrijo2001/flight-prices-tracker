import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Amadeus from 'amadeus';
import dotenv from 'dotenv'

const app = express()
const PORT = process.env.PORT
const amadeus = new Amadeus({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
});
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
    const parameter = req.params.parameter;
    // Which cities or airports start with the parameter variable
    amadeus.referenceData.locations
        .get({
            keyword: parameter,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});

app.get(`/flight-search`, (req, res) => {
    const originCode = req.query.originCode;
    const destinationCode = req.query.destinationCode;
    const dateOfDeparture = req.query.dateOfDeparture
    // Find the cheapest flights
    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: dateOfDeparture,
        adults: '1',
        max: '7'
    }).then(function (response) {
        res.send(response.result);
    }).catch(function (response) {
        res.send(response);
    });
    });

app.use(cors({origin: 'http://localhost:3000'}))

app.listen(PORT, () =>console.log(`Server is running on port: http://localhost:${PORT}`))