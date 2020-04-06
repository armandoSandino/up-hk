const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces');
const { Pool } = require('pg');
const PORT = process.env.PORT || 5000
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

  .get('/db', async( req, res )=> {
    try{
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = {'results':(result) ? result.rows : null };
      res.render('pages/db', results );
      client.release();
    }catch ( error ) {
      console.log( error );
      res.send( "ERROR ", error );
    }
  })

  .get('/cool', (req, res) => res.send(cool()) )
  .get('/times', (req, res ) => res.send( mostrarTiempo() ) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function mostrarTiempo () {
    let result = '';
    const times = process.env.TIMES || 5;
    for ( i=0; i < times; i++ ) {
      result += i+'';
    }
    return result;
  }