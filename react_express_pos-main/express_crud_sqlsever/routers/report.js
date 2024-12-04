const express = require('express');
const sql = require('../config/db');
const router = express.Router();

// ดึงข้อมูลรายการขายทั้งหมด
router.get('/', (req, res) => {
    const query = `
        SELECT 
            o.sale_id,
            o.sale_date,
            o.total_amount,
            e.name,
            c.name
        FROM SALE o
        LEFT JOIN EMPLOYEE e ON o.employee_id = e.employee_id
        LEFT JOIN CUSTOMER c ON o.customer_id = c.customer_id
        ORDER BY o.sale_date DESC
    `;

    sql.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch SALE',
                error: err.message
            });
        }
        return res.json({
            status: 'success',
            result: data.recordset
        });
    });
});

// ดึงรายละเอียดการขายตาม sale_id
router.get('/sale_details/:sale_id', (req, res) => {
    const sale_id = req.params.sale_id;
    
    const request = new sql.Request();
    request.input('sale_id', sql.Int, sale_id);

    const query = `
        SELECT 
            o.sale_id,
            o.sale_date,
            o.total_amount,
            c.name,
            e.name,
            p.payment_method,
            p.amount,
            -- รายละเอียดสินค้า
            si.quantity,
            si.price as unit_price,
            (si.quantity * si.price) as item_total,
            pr.name as product_name,
            pr.description
        FROM SALE o
        LEFT JOIN CUSTOMER c ON o.customer_id = c.customer_id
        LEFT JOIN EMPLOYEE e ON o.employee_id = e.employee_id
        LEFT JOIN PAYMENT p ON o.sale_id = p.sale_id
        LEFT JOIN SALE_ITEM si ON o.sale_id = si.sale_id
        LEFT JOIN PRODUCT pr ON si.product_id = pr.product_id
        WHERE o.sale_id = @sale_id;

        -- คำนวณสรุปยอด
        SELECT 
            COUNT(DISTINCT si.product_id) as total_items,
            SUM(si.quantity) as total_quantity,
            SUM(si.quantity * si.price) as subtotal,
            SUM(si.quantity * si.price) * 0.07 as vat,
            SUM(si.quantity * si.price) * 1.07 as grand_total
        FROM SALE o
        LEFT JOIN  SALE_ITEM si ON o.sale_id = si.sale_id
        WHERE o.sale_id = @sale_id;
    `;

    request.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch sale details',
                error: err.message
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `sale with ID ${sale_id} not found`
            });
        }

        // จัดรูปแบบข้อมูล
        const saleDetails = {
            sale_id: result.recordset[0].sale_id,
            sale_date: result.recordset[0].sale_date,
            name: result.recordset[0].name,
            name: result.recordset[0].name,
            payment_method: result.recordset[0].payment_method,
            items: result.recordset.map(item => ({
                product_name: item.product_name,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                item_total: item.item_total
            })),
            summary: result.recordsets[1][0]
        };

        return res.json({
            status: 'success',
            data: saleDetails
        });
    });
});


// router.get('/top_sales',(req,res)=>{
//       const query =  `SELECT TOP(3) si.product_id, p.name, p.price
//                 FROM SALE_ITEM si
//                 JOIN PRODUCT p ON si.product_id = p.product_id
//                 GROUP BY si.product_id, p.name, p.price
//                 ORDER BY COUNT(si.product_id) DESC;`

//     sql.query(query,(err,data)=>{
//         if(err){
//             console.log(err);
//             return res.status(500).json(
//                {
//                 status: 'error',
//                 message: 'Failed to fetch top 2 product',
//                 error: err.message
//                }
//             )
//         }
//         return res.json({
//             status:'success',
//             result: data.recordset
//         })
//     })           
    
// })

router.get('/top_sales', (req, res) => {
    const query = `
        SELECT 
            RANK() OVER (ORDER BY COUNT(si.product_id) DESC) AS rank,
            si.product_id, 
            p.name, 
            p.price
        FROM SALE_ITEM si
        JOIN PRODUCT p ON si.product_id = p.product_id
        GROUP BY si.product_id, p.name, p.price
        ORDER BY rank
        OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY;
    `;

    sql.query(query, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch top 3 products',
                error: err.message
            });
        }
        return res.json({
            status: 'success',
            result: data.recordset.map((item) => ({
                rank: item.rank,
                product_id: item.product_id,
                name: item.name,
                price: item.price
            }))
        });
    });
});

module.exports = router;