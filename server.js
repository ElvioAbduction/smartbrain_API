const express = require('express');
const bcrypt = require('bcrypt-nodejs');
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

  

const app = express();
app.use(express.json());
app.use(cors());

const database = {
	users: [
	{
		id: '123',
		name: 'John',
		email: 'elviocorona@mail.com',
		password: 'cookies',
		entries: 0,
		joined: new Date()
	},
	{
		id: '234',
		name: 'Sally',
		email: 'sally@mail.com',
		password: 'banana',
		entries: 0,
		joined: new Date()
	}
  ]
}


app.get('/', (req , res) => {
	res.send(database.users);
})


app.post('/signin',(req, res) => {
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('user not found');
	}
})


app.post('/register',(req, res) => {
	db('Users').returning('*').insert({
		Name: req.body.name,
		Email: req.body.email,
		Joined: new Date()
	}).then(response => {
		res.json(response)
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