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

app.set('trust proxy', 1);
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('supabaseUrl:', supabaseUrl);
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

const ACCESS_TOKEN_SECRET = 'accesstokensecret';
const REFRESH_TOKEN_SECRET = 'refreshtokensecret';

let refreshTokens = [];

function generateAccessToken(user) {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: '3h'});
}

app.post('token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ userId: user.userId, username: user.username });
        res.json({ accessToken });
    })
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

        const accessToken = generateAccessToken({userId: user.id, username: user.username});
        const refreshToken = jwt.sign({userId: user.id, username: user.username}, REFRESH_TOKEN_SECRET);

        refreshTokens.push(refreshToken);
        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.post('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
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

// delete user
app.delete('/deleteUser/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('users')
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
    try {
        const { name, description, price, stock, category, tag_name } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Fayl nomi va buffer
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { data, error } = await supabase.storage
            .from("images") // BUCKET NOMI
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            });

        if (error) {
            console.error("Error uploading image:", error);
            return res.status(500).json({ message: "Image upload failed" });
        }

        // Rasmning URL'sini olish
        const { data: publicUrl } = supabase.storage.from("images").getPublicUrl(fileName);
        console.log("Image URL:", publicUrl.publicUrl);

        // Ma'lumotlar bazasiga saqlash
        const { data: product, error: dbError } = await supabase
            .from('products')
            .insert([{ name, description, price, stock, category, image_data: publicUrl.publicUrl, tag_name }])
            .single();

        if (dbError) {
            console.log('Database insert error:', dbError);
            return res.status(500).json({ message: 'Error inserting product' });
        }

        res.status(201).json(product);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// delete product
app.delete('/deleteProduct/:id', async (req, res) => {
    const id = req.params.id;

    try {

        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('image_data')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;


        if (product?.image_data) {

            const imageUrlParts = product.image_data.split('/');
            const fileName = imageUrlParts.slice(4).join('/');


            const { error: deleteError } = await supabase
                .storage
                .from('images')
                .remove([fileName]);

            if (deleteError) throw deleteError;
        }


        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ message: 'Product deleted successfully', data });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

// update product
app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { name, description, price, stock, category, tag_name } = req.body;
    const file = req.file;

    try {
        let imageUrl = null;

        // Eski mahsulotni olish
        const { data: oldProduct, error: fetchError } = await supabase
            .from('products')
            .select('image_data')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // Agar yangi rasm yuklangan bo‘lsa
        if (file) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
                });
            }

            const fileName = `${Date.now()}-${file.originalname}`;

            // **1. Eski rasmni o‘chirish (agar mavjud bo‘lsa)**
            if (oldProduct?.image_data) {
                const oldImagePath = oldProduct.image_data.split('/storage/v1/object/public/images/')[1]; // URL'dan fayl nomini olish
                if (oldImagePath) {
                    const { error: deleteError } = await supabase.storage.from('images').remove([oldImagePath]);
                    if (deleteError) {
                        console.error('Error deleting old image:', deleteError);
                    }
                }
            }

            // **2. Yangi rasm yuklash**
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('images')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });

            if (uploadError) throw uploadError;

            // **3. Yangi rasm URL'ni olish**
            const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        // **4. Mahsulot ma'lumotlarini yangilash**
        const updateFields = { name, description, price, stock, category, tag_name };
        if (imageUrl) updateFields.image_data = imageUrl; // Agar yangi rasm bo‘lsa, yangilash

        const { data, error } = await supabase
            .from('products')
            .update(updateFields)
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: 'Internal Server Error',
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
app.get('/categories', async (req, res) => {
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

// add comment
app.post('/addComment', async (req, res) => {
    const { product_id , user_id, comment } = req.body;

    try{
        const { data, error } = await supabase
            .from('comments')
            .insert([{ product_id, user_id, comment }])
            .single();

        if (error) throw error;

        res.status(201).json(data);
    }catch (err){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// get comments by product id
app.get('/comments/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('product_id', id);

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// delete comment
app.delete('deleteComment/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('comments')
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

// edit comment
app.put('/updateComment/:id', async (req, res) => {
    const id = req.params.id;
    const { comment } = req.body;

    try{
        const { data, error } = await supabase
            .from('comments')
            .update({ comment })
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

// get all comments
app.get('/comments', async (req, res) => {
    try{
        const { data, error } = await supabase
            .from('comments')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})


// add admin
app.post('/addAdmin', async (req, res) => {
    const { name ,username, password } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('admins')
            .insert([{ name , username, password: hashedPassword }])
            .single();

        if (error) throw error;
        

        res.status(201).json(data);
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// get admin information
app.get('/admin/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('admins')
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
})

// admin login
app.post('/adminLogin', async (req, res) => {
    const { username, password } = req.body;

    try{
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();
        console.log('admin:', admin);

        if (error || !admin){
            console.log('Admin not found or Supabase error:', error);
            return res.status(400).json({
                message: 'Invalid username or password'
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch){
            return res.status(400).json({
                message: 'Invalid  password'
            });
        }

        const token = jwt.sign(
            {adminId: admin.id , username: admin.username},
            'secret',
            {expiresIn: '3h'}
        );

        res.json({
            message: 'Admin logged in successfully',
            token: token
        });
    } catch (error){
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
})

// delete admin
app.delete('/deleteAdmin/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const { data, error } = await supabase
            .from('admins')
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

// edit admin
app.put('/updateAdmin/:id', async (req, res) => {
    const id = req.params.id;
    const { name, username, password } = req.body;

    try{
        const updateFields = {};
        if (name) updateFields.name = name;
        if (username) updateFields.username = username;
        if (password) updateFields.password = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('admins')
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
})

app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .or(`category.ilike.%${searchTerm}%, description.ilike.%${searchTerm}% , tag_name.ilike.%${searchTerm}%`);  // Brend va tavsifda ham qidirish


        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});