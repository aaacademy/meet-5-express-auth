const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const bookRoute = require('./app/routes/book.routes');
const authRoute = require('./app/routes/auth.routes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
const { use } = require('express/lib/application');
const Role = db.role;
db.sequelize.sync();
// db.sequelize.sync({forgive: true})
// .then(() => {
//     console.log('Database berhasil di sync');
//     createRoles()
// })

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/books', bookRoute);
app.use('/api/auth', authRoute)

app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));

function createRoles() {
    Role.create({
        id: 1,
        name: 'user'
    })
    Role.create({
        id: 2,
        name: 'moderator'
    })
    Role.create({
        id: 1,
        name: 'admin'
    })
}