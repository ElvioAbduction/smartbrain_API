const express = require('express');
const bcrypt = require('bcrypt-nodejs');
/*const bcrypt = require('bcrypt');*/
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'RapedByAliens',
    database : 'Smart_Brain_DB'
  }
});

/*db.select('*')
  .from('Users')
  .then(data => {
  	console.log(data)
  });*/

 

const someOtherPlaintextPassword = 'not_bacon';

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req , res) => {
	db.select('*').from('Users')
	.then(data=>{
	res.json(data);
	}).catch(err => res.status(400).json(err))
})


app.post('/signin',(req, res) => {
	db.select('email','hash').from('Login')
	.where('email', '=', req.body.email)
	.then(data=>{
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid){
			return db.select('*').from('Users')
			.where('Email','=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('unable to find user'))
		}else{
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
})


app.post('/register',(req, res) => {
	const myPlaintextPassword = req.body.password;
	var hash = bcrypt.hashSync(myPlaintextPassword);
	db.transaction(trx=> {
		trx.insert({
			Name: req.body.name,
			Email: req.body.email,
			Joined: new Date()
		}).into('Users')
		.returning('*')
		.then(data => {
	      return trx('Login').returning('*').insert({
		    hash: hash,
		    email: data[0].Email,
		    UserID: data[0].UserID
	         }).then(response => {
		       res.json(response);
		})
	})
		.then(trx.commit)
		.catch(trx.rollback)
}).catch(err => res.status(400).json(err))
})
	


app.get('/profile/:id', (req,res) => {
	let id = req.params.id;
	db.select('*').from('Users').where({UserID: id})
	.then(user=>{
		if(user.length){
			res.json(user);
		}else{
			res.status(400).json('user not found')
		}
	})
})



app.put('/image', (req , res) =>{
	let id = req.body.id;
	db('Users')
  .where('UserID','=',id)
  .increment('Entries',1)
  .returning('Entries')
  .then(entries => {
  	res.json(entries[0].Entries)
  })
  .catch(err => res.status(400).json(err))
})


/*bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/


app.listen(3000, () => {
	console.log('app is running on port 3000');
});