import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {

    //from the context we need the url and token, using which we can call the API
    const {url,token} = useContext(StoreContext)
    //here we will add the logic where we will fetch all the users data and save it in one state variable
    const [data,setData] = useState([]); //[] is an empty array, this stores the data that we get while testing API, (we get two things while testing API, "success" & "data")
    
    const fetchOrders = async() => {
        //in this one we will call the API and in the response variable below we'll get the response
        const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}})
        setData(response.data.data);
        console.log(response.data.data);
    }
    //we have to call the fetchOrders function, whenever this component will be loaded
    useEffect (()=>{
        if(token){
            fetchOrders();
        }
    },[token]) //whenever the token will be updated, this function will be executed
    /*Why Use useEffect Here?
     ✅ Ensures that orders are fetched only when token is available (e.g., after login).
     ✅ Runs automatically when token changes.
     ✅ Avoids unnecessary API calls when the token remains the same.
     */


  //now we will create the ui using which we can display the users order
  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{ //individual order data and index number
                return(
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{ //The map() function is used to iterate over the items array inside each order. For each item in the array, the function executes the code inside the callback. (item1-index 0, item2-index 1,.....)
                            if(index === order.items.length-1){ //if it is the last item in the array, don't add comma
                                return item.name+" x "+item.quantity
                            }
                            else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        <p>₹{order.amount}.00</p>
                        <p>Items: {order.items.length}</p> {/*total number of items*/}
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p> {/*within the span tag is the x code for bullet point, (&#x25cf) — the Unicode character for a filled circle (•)*/}
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default MyOrders
