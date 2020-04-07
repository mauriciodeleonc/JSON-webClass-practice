const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//middlewares
app.use(express.urlencoded({extended: false}));


//routes
app.get('/', (req,res) => {
    res.render('index');
});

app.post('/tiempo', (req,res) => {
    const ciudad = req.body.ciudad;
    //console.log(ciudad);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=923ae8d5f1d6814d879ebd67130fcb49`;
    //console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        res.render('tiempo', {
            lon: data.coord.lon,
            lat: data.coord.lat,
            ciudad: data.name,
            pais: data.sys.country,
            temp: data.main.temp,
            min: data.main.temp_min,
            max: data.main.temp_max,
            cielo: data.weather[0].description,
            nubosidad: data.clouds.all,
            presion: data.main.pressure,
            humedad: data.main.humidity,
            icon: data.weather[0].icon
        });
    }).catch(err => {
        console.error(err);
    })
});

//static files
app.use(express.static(path.join(__dirname, 'public')));


app.listen(3000, () => console.log('Gator app listening on port 3000!'));