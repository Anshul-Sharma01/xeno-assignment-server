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
        try {
            const params = {
                status: 'any',
                limit: 250,    
            };
            const res = await this.client.get("/orders.json", { params });
            return res.data.orders;
        } catch (error) {
            console.error(`Error fetching orders:`, error.response?.data || error.message);
            throw error;
        }
    }
}

export default ShopifyService;