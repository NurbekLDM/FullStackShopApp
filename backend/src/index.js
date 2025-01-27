const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const express = require('express');
const {Pool} = require('pg');
const app = express();
const cors = require('cors');
const port = 4000;
const helmet  = require('helmet')
const morgan = require('morgan')
const rateLimit  = require('express-rate-limit')
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
app.use(express.json());


// api endpoint larga kirishni cheklash uchun
const limiter = rateLimit({
    windowMs: 15 *60 * 1000, // 15 minut
    max: 100
})
app.use(cors()) // cors hatolarini oldini olish uchun
app.use(limiter);
app.use(morgan('combined')) // xatoliklarni va muhim voqealarni log qilish uchun
app.use(helmet()) // har hil https headers larni qo'yish orqali appni himoya qilish uchun dubulg'a 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;
console.log('Db user:', process.env.DB_USER)
console.log('Db host:', process.env.DB_HOST)
console.log('Db name:', process.env.DB_NAME)
console.log('Db port:', process.env.DB_PORT)
console.log('Db password:', process.env.DB_PASSWORD)


const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// user register
app.post('/register', async (req, res) => {
    const {fullname , username , email, password , address} = req.body

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (fullname, username, email, password, address) 
            VALUES ($1, $2, $3, $4 , $5) RETURNING *`,
            [fullname, username, email, hashedPassword, address]
            )
            res.status(201).json({
                message: 'User registered successfully',
                user: result.rows[0]
            })
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

// user login and create jwt token for user and expired in 3 hours
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    try{
        const userResult = await pool.query(`lsSELECT * FROM users WHERE username = $1`, [username]);
        const user = userResult.rows[0];

        if(!user){
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

      const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({
                message: 'Invalid username or password'
            });
    }

    const token = jwt.sign(
        {userId: user.id , username: user.username},
        'secret',
        {expiresIn: '3h'}
    );

    res.json({
        message: 'User logged in successfully',
        token: token
    });
} catch (error){
    res.status(500).json({
        message: 'Internal Server Error'
    });
}

})

// Edit user information
app.put('/updateProfile/:id', async (req, res) => {
    const id = req.params.id;
    const { fullname, username, password, address } = req.body;

    try {
        // Create an array of fields to update dynamically
        const updateFields = [];
        const updateValues = [];

        // If a field is provided, add it to the update query
        if (fullname) {
            updateFields.push('fullname = $' + (updateValues.length + 1));
            updateValues.push(fullname);
        }
        if (username) {
            updateFields.push('username = $' + (updateValues.length + 1));
            updateValues.push(username);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = $' + (updateValues.length + 1));
            updateValues.push(hashedPassword);
        }
        if (address) {
            updateFields.push('address = $' + (updateValues.length + 1));
            updateValues.push(address);
        }

        // Add the user ID at the end
        updateFields.push('WHERE id = $' + (updateValues.length + 1));
        updateValues.push(id);

        // If no fields were provided for update, return a message
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Prepare the final SQL query
        const query = `UPDATE users SET ${updateFields.join(', ')} RETURNING *`;
        const result = await pool.query(query, updateValues);

        // Send back the updated user data
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


// get user information
app.get('/userProfile/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        res.json(result.rows[0]);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// get all users 
app.get('/users', async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM users`);
        res.json(result.rows);
    } catch (error){
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// get product by id 
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// add product
app.post('/addProduct', upload.single('image'), async (req, res) => {
    try{
    const {name , description , price , stock, category} = req.body;
    const image_data = req.file.buffer;

    const result = pool.query(`INSERT INTO products (name, description, price, stock, category, image_data)`,
    [name, description, price, stock, category, image_data]
    );

    res.status(201).json(result.rows[0]);
} catch (error){
    res.status(500).json({
        message: 'Internal Server Error'
    });
}
})

// delete product
app.delete('/deleteProduct/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);
        res.json(result.rows[0]);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// edit product 
app.put('/updateProduct/:id', async (req, res) => {
    const id = req.params.id;
    const {name, description, price, stock, category} = req.body;
    const image_data = req.file? req.file.buffer: null;

    try{
        let query = `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5`;
        let values = [name, description, price, stock, category];

        if(image_data){
            query += ', image_data = $6';
            values.push(image_data);
        }
        query+= `where id = $7 returning *`; // update product by id
        values.push(id);

        const result = await pool.query(query, values);
        if(result.rows.length ===0){
            return  res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json(result.rows[0]);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// get all products
app.get('/products', async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM products`);
        res.json(result.rows);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// buy product
app.post('/buy-product', async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO history (user_id, product_id) VALUES ($1, $2) RETURNING *`,
            [user_id, product_id]
        );
        res.status(201).json({
            message: "Product purchase recorded successfully",
            history: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// get user purchase history
app.get('/history/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(
            `SELECT * FROM history WHERE user_id = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// get all purchase history
app.get('/history', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM history`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// get card which is belonged to user
app.get('/card/:userId', async(req, res)=>{
    const userId = req.params;
    const result = await pool.query('SELECT * FROM cards WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows[0]);
})

// add card 
app.post('/addCard', async (req, res) => {
    const { card_number, expiry_date, cv, user_id, card_holder } = req.body;

    if (!card_number || !expiry_date || !cv || ! card_holder){
        return res.status(400).json({message: 'All fields are required'})
    }

    try {
        const query = `
            INSERT INTO cards (card_number, expiry_date, cv, user_id, card_holder)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [card_number, expiry_date, cv, user_id, card_holder];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]); // Yaratilgan karta qaytariladi
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// edit card 
app.put('/Updatecard/:id', async (req, res) => {
    const { id } = req.params;  // URL dan karta ID sini olish
    const { card_number, expiry_date, cv, card_holder } = req.body;

    if (!card_number || !expiry_date || !cv || ! card_holder){
        return res.status(400).json({message: 'All fields are required'})
    }
    try {
        const query = `
            UPDATE cards 
            SET card_number = $1, expiry_date = $2, cv = $3, card_holder = $4
            WHERE id = $5 RETURNING *`;
        const values = [card_number, expiry_date, cv, card_holder, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.status(200).json(result.rows[0]); // Yangilangan karta qaytariladi
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// delete card
app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params;  // URL dan karta ID sini olish

    try {
        const result = await pool.query('DELETE FROM cards WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }

        res.status(200).json({ message: 'Card deleted successfully' }); // O'chirilganligi haqida xabar
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

 