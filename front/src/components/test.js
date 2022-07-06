
const express = require('express')
const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
const { Pool, Client } = require('pg')

//khoi dong
const app = express();
app.listen(80, () => {
    console.log('server has started')
})

// Khoi dong bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Khoi dong methodOverride middleware
// app.use(methodOverride('_method'))

// Khoi dong express middleware
app.use(express.json())

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'new',
    password: '260200',
    port: 5432,
})


client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
})

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
    res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	if (res.method == 'OPTIONS')
		res.send(200);
	else next();
})

app.post('/api/getCoordinate', (req,res) =>{
    console.log(req.body);
    const {x ,y} = req.body;
    if(x<500 && y<240 && x>400 && y>40){
        res.json({
            result: 'Inside Box',
        })}
    else{
    res.json({
        result: 'Outside Box',
    })}
})

app.get('/api/get-geometry-vietnam', (req, res) => {

    client.query(`SELECT geom FROM vnm_adm0;`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        console.log(result)
        res.json({ area: result })

    })
});


