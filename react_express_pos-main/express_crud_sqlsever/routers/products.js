const express = require('express');
const sql = require('../config/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');



// Modified storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'E:/Project_POS_1/react_express_pos-main (1)/react_express_pos-main/react-pos/src/assets/img');
   
    },
    filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).fields([
    { name: 'img', maxCount: 1 }
]);



router.get('/',(req,res)=>{
    const query_products =  'SELECT * FROM PRODUCT';
    sql.query(query_products,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
            return res.json(err);
        }
        return res.json({result: data.recordsets[0]});
        

    }) 
})



router.get('/:id',(req,res)=>{
    const product_id = req.params.id;
    const request = new sql.Request();
    request.input('product_id', sql.Int, product_id);

    const query_products =  'SELECT * FROM PRODUCT WHERE product_id = @product_id;';
    request.query(query_products,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
            return res.json(err);
        }
        return res.json({result: data.recordsets[0]});
        

    })
})

// แก้ไข route handler
router.post('/create_product', upload, (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ status: 'error', message: req.fileValidationError });
    }

    const { name, price, stock_quantity, desc, category } = req.body;
    const imgFilename = req.files?.img ? req.files.img[0].filename : null;
    
    const sql_insert = `
        INSERT INTO PRODUCT (name, price, stock_quantity, description, category, img) 
        VALUES (@name, @price, @stock_quantity, @description, @category, @img)
    `;

    const request = new sql.Request();
    request.input('name', sql.NVarChar, name);
    request.input('price', sql.Decimal, price);
    request.input('stock_quantity', sql.Int, stock_quantity);
    request.input('description', sql.NVarChar, desc);
    request.input('category', sql.NVarChar, category);
    request.input('img', sql.NVarChar, imgFilename);

    request.query(sql_insert, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Failed to create product'
            });
        }
        return res.json({ 
            status: 'success', 
            message: 'Product created successfully',
            imagePath: imgFilename
        });
    });
});


// router.put('/update/:id', upload, (req, res) => {
//     const productId = req.params.id;
//     const { name, price, stock_quantity, description, category, img } = req.body;
//     const imgFilename = req.files?.img ? req.files.img[0].filename : null;
//     console.log(imgFilename,'imgFilename');

//     try {
//         const request = new sql.Request();
//         request.input('id', sql.Int, productId);
//         request.input('name', sql.NVarChar(100), name);
//         request.input('price', sql.Decimal(10,2), price);
//         request.input('stock_quantity', sql.Int, stock_quantity);
//         request.input('description', sql.NVarChar(500), description);
//         request.input('category', sql.NVarChar(500), category);
//         request.input('img', sql.NVarChar(255), imgFilename);

//         const updateQuery = `
//             UPDATE PRODUCT 
//             SET name = @name,
//                 price = @price,
//                 stock_quantity = @stock_quantity,
//                 description = @description,
//                 category = @category,
//                 img = @img
//             WHERE product_id = @id;
            
//             SELECT @@ROWCOUNT AS affected;
//         `;

//         request.query(updateQuery, (err, result) => {
//             if (err) {
//                 return res.status(500).json({
//                     status: 'error',
//                     message: 'Failed to update product',
//                     error: err.message
//                 });
//             }

//             return res.json({
//                 status: 'success',
//                 message: 'Product updated successfully'
//             });
//         });

//     } catch (error) {
//         return res.status(500).json({
//             status: 'error',
//             message: 'Server error',
//             error: error.message
//         });
//     }
// });

router.put('/update/:id', upload, (req, res) => {
    const productId = req.params.id;
    const { name, price, stock_quantity, description, category, currentImage } = req.body;
    const imgFilename = req.files?.img ? req.files.img[0].filename : currentImage || '';
    console.log(imgFilename,'imgFilename');

    try {
        const request = new sql.Request();
        request.input('id', sql.Int, productId);
        request.input('name', sql.NVarChar(100), name);
        request.input('price', sql.Decimal(10,2), price);
        request.input('stock_quantity', sql.Int, stock_quantity);
        request.input('description', sql.NVarChar(500), description);
        request.input('category', sql.NVarChar(500), category);
        request.input('img', sql.NVarChar(255), imgFilename);

        const updateQuery = `
            UPDATE PRODUCT 
            SET name = @name,
                price = @price,
                stock_quantity = @stock_quantity,
                description = @description,
                category = @category,
                img = CASE 
                    WHEN @img = '' THEN img  -- ถ้าไม่มีการอัพโหลดรูปใหม่ ให้ใช้รูปเดิม
                    ELSE @img                -- ถ้ามีการอัพโหลดรูปใหม่ ให้ใช้รูปใหม่
                END
            WHERE product_id = @id;
            
            SELECT @@ROWCOUNT AS affected;
        `;

        request.query(updateQuery, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to update product',
                    error: err.message
                });
            }

            return res.json({
                status: 'success',
                message: 'Product updated successfully'
            });
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});


router.put('/clear-image/:id', (req, res) => {
    const product_id = req.params.id;
    const request = new sql.Request();
    request.input('product_id', sql.Int, product_id);

    // First get the current image filename
    const getImageQuery = `
        SELECT img FROM PRODUCT 
        WHERE product_id = @product_id;
    `;

    request.query(getImageQuery, (getErr, getResult) => {
        if (getErr) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to get product image',
                error: getErr.message
            });
        }

        const currentImage = getResult.recordset[0]?.img;
        if (currentImage) {
            const imagePath = path.join('D:/project/pos/fullstack-pos/react-pos/src/assets/img', currentImage);
            
            // Delete file if it exists
            if (fs.existsSync(imagePath)) {
                try {
                    fs.unlinkSync(imagePath);
                } catch (unlinkErr) {
                    console.error('Failed to delete image file:', unlinkErr);
                }
            }
        }

        // Clear image field in database
        const updateQuery = `
            UPDATE PRODUCT 
            SET img = '' 
            WHERE product_id = @product_id;
            SELECT @@ROWCOUNT AS affected;
        `;

        request.query(updateQuery, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to clear image field',
                    error: err.message
                });
            }

            if (result.recordset[0].affected === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Product not found'
                });
            }

            return res.json({
                status: 'success',
                message: 'Image cleared from database and file system'
            });
        });
    });
});

router.delete('/delete/:id', (req, res) => {
    const product_id = req.params.id;

    try {
        const request = new sql.Request();
        request.input('product_id', sql.Int, product_id);

        // เช็คก่อนว่ามีสินค้าอยู่หรือไม่
        const checkQuery = `
            SELECT product_id 
            FROM PRODUCT 
            WHERE product_id = @product_id
        `;

        request.query(checkQuery, (checkErr, checkData) => {
            if (checkErr) {
                console.log(checkErr);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to check product',
                    error: checkErr.message
                });
            }

            if (!checkData.recordset || checkData.recordset.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: `Product with ID ${product_id} not found`
                });
            }

            // ถ้ามีสินค้าอยู่ ทำการลบ
            const deleteQuery = `
                DELETE FROM PRODUCT 
                WHERE product_id = @product_id;
                
                SELECT @@ROWCOUNT AS affected;
            `;

            request.query(deleteQuery, (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.log(deleteErr);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Failed to delete product',
                        error: deleteErr.message
                    });
                }

                return res.json({
                    status: 'success',
                    message: 'Product deleted successfully'
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        });
    }
});

router.get('/category/:name', (req, res) => {
    const categoryName = req.params.name;
    const request = new sql.Request();
    
    // Properly bind the parameter
    request.input('name', sql.NVarChar, categoryName);
    
    const query = `
        SELECT *
        FROM PRODUCT
        WHERE category LIKE '%' + @name + '%'
    `;

    request.query(query, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch products by category',
                error: err.message
            });
        }
        
        return res.json({
            status: 'success',
            result: data.recordset
        });
    });
});




module.exports = router;