import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe" //for adding the payment gateway
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//First API, /place
//placing user order for frontend
//here we will add the logic using which we can place the order
const placeOrder = async (req,res) =>{

    const frontend_url = "http://localhost:5174"; //frontend url

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save(); //after that it will save the order in our database  
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}}); //after the user has placed the order, we have to clear the user's cart
        
        //after that we will create the logic using which we will add the payment link using stripe
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr", //7:56:29 hr in lecture
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100 //in paise
                //unit_amount field represents the price of a single unit of the product in the smallest currency unit (paise for INR, cents for USD, etc.) when using Stripe for payments.
            }, 
            quantity:item.quantity
        }))

        //for delivery charges
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100 //we have added the delivery charges rupees 2 in our frontend, 2*100 paise
            },
            quantity:1  //The user is charged once for delivery.
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            //if the payment will be successful, we will be redirected to the success page, else cancel url
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`, //here we have created the route verify
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({success:true,session_url:session.url})
   
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error", error:error.message})
    }
}

//Second API, /verify
//4242424242424242 stripe payment card number for USA
//here we will create a temporary payment verification system (came here after testing stripe payments in frontend)
const verifyOrder = async(req,res) => {
    //here we will add the logic using that we can verify the order payment
    const{orderId,success} = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true, message:"Paid"})
        }  
        else{
            await orderModel.findByIdAndDelete(orderId); //we'll delete this order
            res.json({success:false,message:"Not Paid"})
        }      
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error", error:error.message})  
    }
    //now we will integrate this verify order API with our frontend
}



//Third API endpoint in orderControllers, /userorders
//user orders for frontend (Orders that we get while hovering on the profile icon in frontend home page)
const userOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId}) //we'll get all the orders from this particular user id and it will be tsored in this orders variable
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})       
    }
}
//now we will test this API endpoint
//now we will link this API with our frontend




//Fourth API, 
//logic to find all the orders of all the users (In admin Panel)
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({}); //we'll get all the orders data in this variable, The empty {} inside .find({}) means "find all records".
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
//now we have to integrate this API with our admin panel


//Fifth API, for updating the food status(Food processing, Out for delivery or Delivered)
const updateStatus = async(req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}