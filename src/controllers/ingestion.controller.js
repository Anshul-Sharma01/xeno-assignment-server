import db from "../models/index.js";
import ShopifyService from "../services/shopify.service.js";


class IngestionController{
    static async syncTenantData(req, res){
        try{
            const { tenantId } = req.params;
            const tenant = await db.Tenant.findByPk(tenantId);

            if(!tenant){
                return res.status(404)
                .json({
                    success : false,
                    error : "Tenant does not exists !!"
                });
            }

            const shopify = new ShopifyService(tenant.shopifyDomain, tenant.accessToken);

            const customers = await shopify.fetchCustomers();


            for(const customer of customers){
                await db.Customer.upsert({
                    tenant_id : tenantId,
                    first_name : customer.first_name,
                    last_name : customer.last_name,
                    email : customer.email,
                    phone : customer.phone,
                    accepts_email_marketing : customer.accepts_marketing,
                    default_address : customer.default_address,
                    tags : customer.tags,
                    raw_data : customer
                })
            }

            const products = await shopify.fetchProducts();
            for(const product of products){
                await db.Product.upsert({
                    tenant_id : tenantId,
                    handle : product.handle,
                    title : product.title,
                    body_html : product.body_html,
                    vendor : product.vendor,
                    product_type : product.product_type,
                    tags : product.tags,
                    published : product.status === "active",
                    price: product.variants[0]?.price || 0,
                    sku: product.variants[0]?.sku || null,
                    inventory_qty: product.variants[0]?.inventory_quantity || 0,
                    image_src: product.image?.src || null,
                    options: product.options,
                    raw_data: product
                })
            }

            const orders = await shopify.fetchOrders();
            for(const order of orders){
                await db.Order.upsert({
                    tenantId: tenantId,
                    order_id: order.id,
                    customer_id: order.customer?.id,
                    email: order.email,
                    total_price: order.total_price,
                    subtotal_price: order.subtotal_price,
                    total_tax: order.total_tax,
                    total_discounts: order.total_discounts,
                    currency: order.currency,
                    financial_status: order.financial_status,
                    fulfillment_status: order.fulfillment_status,
                    line_items: order.line_items,
                    shipping_address: order.shipping_address,
                    billing_address: order.billing_address,
                    tags: order.tags,
                    created_at: order.created_at,
                    updated_at: order.updated_at,
                    raw_data: order
                });
            }

            return res.json({
                success : true,
                message : "Tenant data synced successfully"
            })

        }catch(err){
            console.error(`Sync failed : ${err}`);
            res.status(500)
            .json({
                success : false,
                error : "Failed to sync tenant data"
            })
        }
    }
}

export default IngestionController;