
const axios = require('axios');

const getOrderInfo = async (orderId) => {


  try {

    const headers = {
      'Authentication': 'bearer 0cbfc63d776f1aefe03bf880990f1c276bee5561',
      'User-Agent': 'vicoTest (nahuelgalvan@gmail.com)'
    }

   //all orders 
   //const query = axios.get('https://api.tiendanube.com/v1/857971/orders?status=open&fields=id,number', {
    
    const url = `https://api.tiendanube.com/v1/857971/orders/${orderId}?fields=id,number,contact_name,payment_status,created_at,subtotal,customer,shipping_option_code,shipping_option,products,total,note`
    const query = axios.get(url, {
      headers: headers
  
    })
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });

    return query

  } catch (e) {
    // Log Errors
    throw Error('Error curl tienda nube getOrderInfo')
  }
}

module.exports = { getOrderInfo }