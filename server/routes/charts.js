const express = require('express');
const router = express.Router();
const connectDB = require('../db/connect_db');

router.get('/total-sales', async (req, res) => {
    try {
        const client = await connectDB(); // Wait for the connection to complete
        const db = client.db('RQ_Analytics'); // Replace with your actual database name
        const Order = db.collection('shopifyOrders');
        const sales = await Order.aggregate([
            {
                $addFields: {
                    created_at_date: { $dateFromString: { dateString: "$created_at" } }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at_date" },
                        month: { $month: "$created_at_date" },
                        day: { $dayOfMonth: "$created_at_date" },
                        quarter: {
                            $cond: {
                                if: { $lte: [{ $month: "$created_at_date" }, 3] },
                                then: 1,
                                else: {
                                    $cond: {
                                        if: { $lte: [{ $month: "$created_at_date" }, 6] },
                                        then: 2,
                                        else: {
                                            $cond: {
                                                if: { $lte: [{ $month: "$created_at_date" }, 9] },
                                                then: 3,
                                                else: 4
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    totalSales: { $sum: { $toDouble: "$total_price" } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]).toArray(); // Ensure you call toArray to get the result set
        
        res.json(sales);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sales-growth-rate', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('RQ_Analytics');
        const Order = db.collection('shopifyOrders');

        const salesGrowth = await Order.aggregate([
            {
                $addFields: {
                    created_at: {
                        $dateFromString: { dateString: "$created_at" }
                    }
                }
            },
            {
                
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" }
                    },
                    totalSales: { $sum: { $toDouble: "$total_price" } }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                
                $setWindowFields: {
                    sortBy: { "_id.year": 1, "_id.month": 1 },
                    output: {
                        previousSales: {
                            $shift: {
                                output: "$totalSales",
                                by: -1
                            }
                        }
                    }
                }
            },
            {
                
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalSales: 1,
                    growthRate: {
                        $cond: {
                            if: { $eq: ["$previousSales", null] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: [{ $subtract: ["$totalSales", "$previousSales"] }, "$previousSales"] },
                                    100
                                ]
                            }
                        }
                    }
                }
            }
        ]).toArray();

        res.json(salesGrowth);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 3. New Customers Added Over Time
router.get('/new-customers', async (req, res) => {
    try {
        const client = await connectDB(); // Wait for the connection to complete
        const db = client.db('RQ_Analytics'); // Replace with your actual database name
        const Customer = db.collection('shopifyCustomers'); // Ensure the correct collection name

        const newCustomers = await Customer.aggregate([
            {   
                $addFields: {
                    created_at: {
                        $dateFromString: { dateString: "$created_at" }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" },
                        day: { $dayOfMonth: "$created_at" }
                    },
                    newCustomerIds: { $addToSet: "$id" } // Collect unique customer IDs
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day",
                    count: { $size: "$newCustomerIds" } // Count the number of unique customers
                }
            },
            { $sort: { year: 1, month: 1, day: 1 } } // Sort by date
        ]).toArray();

        res.json(newCustomers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/repeated-customers', async (req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('RQ_Analytics');
        const orders = db.collection('shopifyOrders');

        // Aggregate data
        const [dailyData, monthlyData, quarterlyData, yearlyData] = await Promise.all([
            orders.aggregate([
                {
                    $addFields: {
                        created_at: {
                            $dateFromString: { dateString: "$created_at" }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            customerId: "$customer.id",
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }
                        },
                        orderCount: { $sum: 1 }
                    }
                },
                { $match: { orderCount: { $gt: 1 } } },
                { $group: { _id: "$_id.date", count: { $sum: 1 } } },
                { $sort: { "_id": 1 } }
            ]).toArray(),

            orders.aggregate([
                {
                    $addFields: {
                        created_at: {
                            $dateFromString: { dateString: "$created_at" }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            customerId: "$customer.id",
                            year: { $year: "$created_at" },
                            month: { $month: "$created_at" }
                        },
                        orderCount: { $sum: 1 }
                    }
                },
                { $match: { orderCount: { $gt: 1 } } },
                { $group: { _id: { year: "$_id.year", month: "$_id.month" }, count: { $sum: 1 } } },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]).toArray(),

            orders.aggregate([
                {
                    $addFields: {
                        created_at: {
                            $dateFromString: { dateString: "$created_at" }
                        }
                    }
                },

                {
                    $group: {
                        _id: {
                            customerId: "$customer.id",
                            year: { $year: "$created_at" },
                            quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } }
                        },
                        orderCount: { $sum: 1 }
                    }
                },
                { $match: { orderCount: { $gt: 1 } } },
                { $group: { _id: { year: "$_id.year", quarter: "$_id.quarter" }, count: { $sum: 1 } } },
                { $sort: { "_id.year": 1, "_id.quarter": 1 } }
            ]).toArray(),

            orders.aggregate([
                {
                    $addFields: {
                        created_at: {
                            $dateFromString: { dateString: "$created_at" }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            customerId: "$customer.id",
                            year: { $year: "$created_at" }
                        },
                        orderCount: { $sum: 1 }
                    }
                },
                { $match: { orderCount: { $gt: 1 } } },
                { $group: { _id: "$_id.year", count: { $sum: 1 } } },
                { $sort: { "_id": 1 } }
            ]).toArray()
        ]);

        // Combine data
        const combinedData = {
            daily: dailyData,
            monthly: monthlyData,
            quarterly: quarterlyData,
            yearly: yearlyData
        };

        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 5. Geographical Distribution of Customers
router.get('/customer-geography', async (req, res) => {
    try {
        const client = await connectDB(); // Wait for the connection to complete
        const db = client.db('RQ_Analytics'); // Replace with your actual database name
        const Order = db.collection('shopifyOrders');
        const geography = await Order.aggregate([

            {
                $addFields: {
                    created_at: {
                        $dateFromString: { dateString: "$created_at" }
                    }
                }
            },
            {
                $group: {
                    _id: "$customer.default_address.city",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        res.json(geography);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/cohort-lifetime-value', async (req, res) => {
  try {
    const client = await connectDB();
    const db = client.db('RQ_Analytics'); // Replace with your actual database name
    const Customers = db.collection('shopifyCustomers');
    const Orders = db.collection('shopifyOrders');
    console.log(await Customers.find({}).toArray());
    console.log(await  Orders.find({}).toArray());
    
    // Aggregate customers and their lifetime values by cohort
    const cohortData = await Customers.aggregate([
      {
        $lookup: {
          from: 'shopifyOrders',
          localField: 'id',
          foreignField: 'customer_id',
          as: 'orders'
        }
      },
      {
        $addFields: {
          firstPurchaseMonth: {
            $dateToString: { format: "%Y-%m", date: { $arrayElemAt: ["$orders.created_at", 0] } }
          }
        }
      },
      {
        $group: {
          _id: "$firstPurchaseMonth",
          lifetimeValue: { $sum: { $sum: "$orders.total_price" } },
          customerCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    res.json(cohortData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


module.exports = router;
