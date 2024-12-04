const express = require('express');
const sql = require('../config/db');
const router = express.Router();


router.get('/',(req,res) => {
    const query_products = `
                    SELECT s.sale_id, s.sale_date, s.total_amount, e.name
                    FROM SALE s
                    INNER JOIN EMPLOYEE e ON s.employee_id = e.employee_id
                    `
    sql.query(query_products,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
            return res.json(err);
        }
        return res.json({result: data.recordsets[0]});
        

    }) 
})



// API สำหรับดึงรายละเอียดใบเสร็จตาม sale_id
router.get('/order_details/:sale_id', (req, res) => {
    const sale_id = req.params.sale_id;
    
    const request = new sql.Request();
    request.input('sale_id', sql.Int, sale_id);

    const query = `
        SELECT 
            s.sale_id,
            s.sale_date,
            s.total_amount,
            c.name,
            e.name,
            p.payment_method,
            p.amount as payment_amount,
            -- รายละเอียดสินค้า
            si.quantity,
            si.price as unit_price,
            (si.quantity * si.price) as item_total,
            pr.name as product_name,
            pr.description as product_description
        FROM SALE s
        LEFT JOIN CUSTOMER c ON s.customer_id = c.customer_id
        LEFT JOIN EMPLOYEE e ON s.employee_id = e.employee_id
        LEFT JOIN PAYMENT p ON s.sale_id = p.sale_id
        LEFT JOIN SALE_ITEM si ON s.sale_id = si.sale_id
        LEFT JOIN PRODUCT pr ON si.product_id = pr.product_id
        WHERE s.sale_id = @sale_id;

        -- คำนวณสรุปยอด
        SELECT 
            COUNT(DISTINCT si.product_id) as total_items,
            SUM(si.quantity) as total_quantity,
            SUM(si.quantity * si.price) as subtotal,
            SUM(si.quantity * si.price) * 0.07 as vat,
            SUM(si.quantity * si.price) * 1.07 as grand_total
        FROM SALE s
        LEFT JOIN SALE_ITEM si ON s.sale_id = si.sale_id
        WHERE s.sale_id = @sale_id;
    `;

    request.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch order details',
                error: err.message
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Order with ID ${sale_id} not found`
            });
        }

        // จัดรูปแบบข้อมูล
        const orderDetails = {
            sale_id: result.recordset[0].sale_id,
            sale_date: result.recordset[0].sale_date,
            customer_name: result.recordset[0].customer_name,
            employee_name: result.recordset[0].employee_name,
            payment_method: result.recordset[0].payment_method,
            items: result.recordset.map(item => ({
                product_name: item.product_name,
                description: item.product_description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                item_total: item.item_total
            })),
            summary: {
                total_items: result.recordsets[1][0].total_items,
                total_quantity: result.recordsets[1][0].total_quantity,
                subtotal: result.recordsets[1][0].subtotal,
                vat: result.recordsets[1][0].vat,
                grand_total: result.recordsets[1][0].grand_total
            }
        };

        return res.json({
            status: 'success',
            data: orderDetails
        });
    });
});




router.post('/place_order', async (req, res) => {
    const { customer_id, employee_id, items, payment_method, total_amount  } = req.body;

    // สร้าง transaction
    const transaction = new sql.Transaction();
    
    try {
        // เริ่ม transaction
        await transaction.begin();
        
        // 1. ตรวจสอบ customer
        // const customerCheck = await new sql.Request(transaction)
        //     .input('customer_id', sql.Int, customer_id)
        //     .query('SELECT customer_id FROM CUSTOMER WHERE customer_id = @customer_id');
            
        // if (!customerCheck.recordset.length) {
        //     throw new Error('Customer not found');
        // }

        // 2. สร้าง sale record
        const saleResult = await new sql.Request(transaction)
            .input('customer_id', sql.Int, customer_id)
            .input('employee_id', sql.Int, employee_id)
            .input('sale_date', sql.DateTime, new Date())
            .input('total_amount', sql.Decimal(10, 2), total_amount)
            .query(`
                INSERT INTO SALE (customer_id, employee_id, sale_date, total_amount)
                OUTPUT INSERTED.sale_id
                VALUES (@customer_id, @employee_id, @sale_date, @total_amount)
            `);

        const sale_id = saleResult.recordset[0].sale_id;

        // 3. เพิ่ม sale items และอัพเดท stock
        for (const item of items) {
            await new sql.Request(transaction)
                .input('sale_id', sql.Int, sale_id)
                .input('product_id', sql.Int, item.product_id)
                .input('quantity', sql.Int, item.quantity)
                .input('price', sql.Decimal(10, 2), item.price)
                .query(`
                    INSERT INTO SALE_ITEM (sale_id, product_id, quantity, price)
                    VALUES (@sale_id, @product_id, @quantity, @price);

                    UPDATE PRODUCT 
                    SET stock_quantity = stock_quantity - @quantity
                    WHERE product_id = @product_id;
                `);
        }

        // 4. บันทึกการชำระเงิน
        await new sql.Request(transaction)
            .input('sale_id', sql.Int, sale_id)
            .input('payment_method', sql.NVarChar, payment_method)
            .input('amount', sql.Decimal(10, 2), total_amount)
            .query(`
                INSERT INTO PAYMENT (sale_id, payment_method, amount)
                VALUES (@sale_id, @payment_method, @amount)
            `);

        // Commit transaction
        await transaction.commit();

        res.json({
            status: 'success',
            message: 'Order placed successfully',
            sale_id: sale_id
        });

    } catch (error) {
        try {
            // Rollback transaction ถ้าเกิดข้อผิดพลาด
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Rollback error:', rollbackError);
        }

        res.status(500).json({
            status: 'error',
            message: error.message,
            error: error.toString()
        });
    }
});


router.get('/serial_number',(req,res) => {
    const query =`SELECT TOP(1) sale_id FROM SALE ORDER BY sale_id DESC `

    sql.query(query,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send('Server Error');
            return res.json(err);
        }
        return res.json({
            status: 'success',
            result: data.recordset
        });
        

    }) 
})



module.exports = router;