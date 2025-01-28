const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// multer orqali rasmni yuklash uchun
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// api endpoint larga kirishni cheklash uchun
const limiter = rateLimit({
    windowMs: 15 *60 * 1000, // 15 minut
    max: 100
})
app.use(cors()) // cors hatolarini oldini olish uchun
app.use(limiter);
app.use(morgan('combined')) // xatoliklarni va muhim voqealarni log qilish uchun
app.use(helmet()) // har hil https headers larni qo'yish orqali appni himoya qilish uchun dubulg'a 

// user register
app.post('/register', async (req, res) => {
    const {fullname , username , email, password , address} = req.body

    if (!fullname || !username || !email || !password || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{ fullname, username, email, password: hashedPassword, address }])
            .single();

        if (error) {
            console.log('Supabase err: ', error);
            throw error
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: data
        });
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// user login and create jwt token for user and expired in 3 hours
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    try{
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
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
});

// Edit user information
app.put('/updateProfile/:id', async (req, res) => {
    const id = req.params.id;
    const { fullname, username, password, address } = req.body;

    try {
        const updateFields = {};
        if (fullname) updateFields.fullname = fullname;
        if (username) updateFields.username = username;
        if (password) updateFields.password = await bcrypt.hash(password, 10);
        if (address) updateFields.address = address;

        const { data, error } = await supabase
            .from('users')
            .update(updateFields)
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
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
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// get all users 
app.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }


        res.json(data);
    } catch (error) {
        console.error('Catch error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get product by id 
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
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

        const { data, error } = await supabase
            .from('products')
            .insert([{ name, description, price, stock, category, image_data }])
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// delete product
app.delete('/deleteProduct/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// edit product 
app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const {name, description, price, stock, category} = req.body;
    const image_data = req.file ? req.file.buffer : null;

    try{
        const updateFields = { name, description, price, stock, category };
        if (image_data) updateFields.image_data = image_data;

        const { data, error } = await supabase
            .from('products')
            .update(updateFields)
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// get all products
app.get('/products', async (req, res) => {
    try{
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;

        res.json(data);
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
        const { data, error } = await supabase
            .from('history')
            .insert([{ user_id, product_id }])
            .single();

        if (error) throw error;

        res.status(201).json({
            message: "Product purchase recorded successfully",
            history: data,
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
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', id);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// get all purchase history
app.get('/history', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('history')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// get card which is belonged to user
app.get('/card/:userId', async(req, res) => {
    const userId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// add card 
app.post('/addCard', async (req, res) => {
    const { card_number, expiry_date, cv, user_id, card_holder } = req.body;

    if (!card_number || !expiry_date || !cv || ! card_holder){
        return res.status(400).json({message: 'All fields are required'})
    }

    try {
        const { data, error } = await supabase
            .from('cards')
            .insert([{ card_number, expiry_date, cv, user_id, card_holder }])
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// edit card 
app.put('/Updatecard/:id', async (req, res) => {
    const { id } = req.params;
    const { card_number, expiry_date, cv, card_holder } = req.body;

    if (!card_number || !expiry_date || !cv || ! card_holder){
        return res.status(400).json({message: 'All fields are required'})
    }

    try {
        const { data, error } = await supabase
            .from('cards')
            .update({ card_number, expiry_date, cv, card_holder })
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// delete card
app.delete('/cards/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('cards')
            .delete()
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// get category
app.get('/category', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

//add category
app.post('/addCategory', async (req, res) => {
    const { name } = req.body;

    try{
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name }])
            .single();

        if (error) throw error;

        res.status(201).json(data);
    }catch (err){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// edit category
app.put('/updateCategory/:id', async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    try{
        const { data, error } = await supabase
            .from('categories')
            .update({ name })
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// delete category
app.delete('/deleteCategory/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})