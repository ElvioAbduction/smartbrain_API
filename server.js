const express = require('express');

const app = express();
app.use(express.json());

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
		res.json('success');
	}else{
		res.status(400).json('user not found');
	}
})


app.post('/register',(req, res) => {
	database.users.push({
		id: '345',
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1])
})


app.get('/profile/:id', (req,res) => {
	let id = req.params.id;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})
if (found === false){
		res.status(404).json('no such user');
		}
})



app.put('/image', (req , res) =>{
	let id = req.body.id;
	let found = false;
	database.users.forEach(user=>{
		if (user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries)
		}
	})
	if (found === false){
		res.status(404).json('user not found');
	}
})


app.listen(3000, () => {
	console.log('app is running on port 3000');
});