const {Order} = require("../Data/order");
const express = require("express");
const router = express.Router();
const { OrderItem } = require('../Data/item');

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'username').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'username')
    .populate({ path: 'orderItems', populate: {
            path : 'product',
            populate: 'category'
        }
    });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

router.post(`/`, async (req, res) => {

   const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);

  const order = new Order({
    user_id: req.body.user_id,
      order_date: req.body.order_date,
      status: req.body.status,
      Items: orderItemsIdsResolved,
      totalPrice: totalPrice,
      shipping_id: req.body.shipping_id,
      payment_id: req.body.payment_id,
   
  });
 order = await order.save();
  if (!order) {
    return res.status(500).send("The order cannot be created");
  }
  res.send(order);
  
});



router.put(`/:id`, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      user_id: req.body.user_id,
      order_date: req.body.order_date,
      status: req.body.status,
      Items: req.body.Items,
      totalPrice: totalPrice,
      shipping_id: req.body.shipping_id,
      payment_id: req.body.payment_id,
    },
    { new: true }
  );

  if (!order) {
    return res.status(500).send("The order cannot be updated");
  }
  res.send(order);
});

router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})
module.exports = router;


