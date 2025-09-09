import db from "../models/index.js";
import ShopifyService from "./shopify.service.js";

class ShopifySyncService{
    constructor(){}

    async syncTenantData(tenant){
        try{
            const shopify = new ShopifyService(tenant.shopifyDomain, tenant.accessToken);

            const customers = await shopify.fetchCustomers();
            for(const cust of customers){
                await db.Customer.upsert({
                    external_id : String(cust.id),
                    tenantId : tenant.id,
                    first_name : cust.first_name,
                    last_name : cust.last_name,
                    email : cust.email,
                    phone : cust.phone,
                    default_address : cust.default_address,
                    tags : cust.tags,
                    raw_data : cust
                });
            }

            const products = await shopify.fetchProducts();
            for(const prod of products){
                await db.Product.upsert({
                    external_id : String(prod.id),
                    tenantId : tenant.id,
                    handle : prod.handle || `product-${prod.id}`,
                    title : prod.title,
                    body_html : prod.body_html,
                    vendor : prod.vendor,
                    product_type : prod.product_type,
                    tags : prod.tags,
                    published : prod.status === "active",
                    price: prod.variants?.[0]?.price ? Number(prod.variants[0].price) : 0,
                    sku: prod.variants?.[0]?.sku || null,
                    inventory_qty: prod.variants?.[0]?.inventory_quantity
                    ? Number(prod.variants[0].inventory_quantity)
                    : 0,
                    image_src : prod.image?.src || null,
                    options : prod.options,
                    raw_data : prod
                });
            }

            const orders = await shopify.fetchOrders();
            for(const order of orders){
                await db.Order.upsert({
                    tenantId : tenant.id,
                    order_id : order.id,
                    customer_id : order.customer?.id,
                    email : order.email,
                    total_price : order.total_price,
                    subtotal_price : order.subtotal_price,
                    total_tax : order.total_tax,
                    total_discounts : order.total_discounts,
                    currency : order.currency,
                    financial_status : order.financial_status,
                    fulfillment_status : order.fulfillment_status,
                    line_items : order.line_items,
                    shipping_address : order.shipping_address,
                    billing_address : order.billing_address,
                    tags : order.tags,
                    created_at : order.created_at,
                    updated_at : order.updated_at,
                    raw_data : order,
                })
            }

            console.log(`Tenant synced : ${tenant?.name}`);
        }catch(error){    
            console.error(`Failed to sync tenant : ${tenant?.name}`, error?.message);
            throw error;
        }
    }
}

export default ShopifySyncService;

