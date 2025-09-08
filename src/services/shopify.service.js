import axios from "axios";

class ShopifyService{
    constructor(shopifyDomain, accessToken){
        this.client = axios.create({
            baseURL : `https://${shopifyDomain}/admin/api/2025-01`,
            headers : {
                "X-Shopify-Access-Token" : accessToken,
                "Content-Type" : "application/json"
            }
        })
    }

    async fetchCustomers(){
        const res = await this.client.get("/customers.json");
        return res.data.customers;
    }

    async fetchProducts(){
        const res = await this.client.get("/products.json");
        return res.data.products;
    }

    async fetchOrders(){
        const res = await this.client.get("/orders.json");
        return res.data.orders;
    }
}

export default ShopifyService;