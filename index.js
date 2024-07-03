const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const ipinfoToken = '34e1d9e491e1b4';
const weatherKey = '9aeb448e5013c821f9fe6cc0e7748ef9'

app.get('/api/hello', async (req, res) => {

    const sanitizeVisitorName = (visitorName) => {
        return visitorName.replace(/^["'](.+(?=["']$))["']$/, '$1');
    };

    //const clientIp = req.ip; for deployment
    const clientIp = '196.27.128.80'; //comment this out
    const visitorName = sanitizeVisitorName(req.query.visitor_name || 'Guest');


    try {
      const response = await axios.get(`https://ipinfo.io/${clientIp}?token=${ipinfoToken}`);
      const locationData = response.data;
      const coordinate = locationData.loc;
      const [lat, lon] = coordinate.split(',');


      const city = locationData.city;

      //Remove comment on deployment
      //const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`);
      //const weatherData = response2.data;
      //const temperature = weatherData.main.temp
      
      //put '"temperature": ${temperature},' when api key is ready

      res.json({
        client_ip: clientIp,
        location: city,
        latitude: lat,
        longitude: lon,
        greeting: "Hello " + visitorName + ", the temperature is 35 degrees Celcius in " + city
    });
    } catch (error) {
      console.error('Error fetching location data:', error);
      res.status(500).send('Error fetching location data');
    }
  });
app.listen(3000, () => {
    console.log("listening on port 3000");
})
// latitude, longitude = 7.4824,4.5603