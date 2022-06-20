const  express = require('express')
const  Cors = require( 'cors')
const  authRoutes = require('./routes/auth-routes')
const  apiRoutes = require('./routes/api-routes')
const  caseRoutes = require('./routes/case-routes')
const  emailRoutes = require('./routes/email-routes')
const  db = require( './models/index')
const {authMiddleware} = require('./middleware/auth-middleware')
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })


const app = express()

app.use(Cors({origin: true}))

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// gmail auth routes
app.use('/', authRoutes)

// auth middleware for api routes
app.use(authMiddleware)

// gmail api routes
app.use('/api', apiRoutes)

// case api routes

app.use('/case', caseRoutes)

app.use('/email', emailRoutes)

// start the server
const PORT = process.env.PORT
console.log("port", PORT)
db.sequelize.sync().then(() => {
	try {	
		app.listen(PORT || 5000, () => {
		console.log(`App listening on port http://localhost:${PORT}`)
		})
	} catch (error) {
		console.log("error",error)
	}
});

