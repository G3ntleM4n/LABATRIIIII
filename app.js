const {PrismaClient} = require('@prisma/client')
const exp = require("express")
const fs = require('fs')
const app = exp()
const db = new PrismaClient()

app.post('/user', async (req, res) => {
	const { query } = req

	const name = query.name
	const age = +query.age
	const password = query.password

	const newUser = await db.user.create({
		data: {
			name: name,
			age: age,
			password: password
		}
	})

	res.json(newUser)
})

app.patch('/user', async (req, res) => {
	const { query } = req
	const name = query.name
	const age = query.age
	const password = query.password

	const newUser = await db.user.update({
		where: {
			name:	name
		},
		data: {
			age:	age,
			password:	password
		}
	})
	res.json(newUser)
})

app.get('/user', async (req, res) => {
	const users = await db.user.findMany({
		select: {
			age: true,
			id: true,
			name: true
		}
	})
	res.json(users)
})
app.get('/user/:id', async (req, res) => {
	const userId = req.params.id
	const user = await db.user.findFirst({
		where:{
			id: +userId
		},
		select: {
			age: true,
			id: true,
			name: true
		}
	})

	res.json(user)
})

app.get('/', async (req, res) => {
	const html = fs.readFileSync('./index.html').toString()
	const users = await (await fetch('http://localhost:8000/user')).json()
	const usrows = users.map((user) => {
		return `
			<tr>
				<td>${user.id}</td>
				<td>${user.name}</td>
				<td>${user.age}</td>
			</tr>
		`
	}).join()

	res.write(html.replace('{{users}}',usrows))
	res.send()
})

app.listen(8000)