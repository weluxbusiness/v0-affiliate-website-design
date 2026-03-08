-- Seed data for programmatic SEO pages
-- Run this script to populate stores, categories, and sample coupons

-- Insert stores
INSERT INTO stores (name, slug, description, rating, review_count, color, is_active, meta_title, meta_description) VALUES
('Amazon', 'amazon', 'The world''s largest online retailer with millions of products across every category.', 4.5, 15000, 'from-orange-500 to-orange-600', true, 'Amazon Deals & Coupons', 'Find the best Amazon deals and coupon codes.'),
('Best Buy', 'best-buy', 'Leading electronics retailer offering the latest tech, appliances, and gadgets.', 4.3, 8500, 'from-blue-600 to-blue-700', true, 'Best Buy Deals & Coupons', 'Save on electronics with Best Buy deals.'),
('Nike', 'nike', 'Global leader in athletic footwear, apparel, and equipment.', 4.6, 12000, 'from-gray-800 to-gray-900', true, 'Nike Deals & Coupons', 'Find Nike shoe and apparel deals.'),
('Target', 'target', 'Popular retailer offering quality products at affordable prices.', 4.4, 9000, 'from-red-500 to-red-600', true, 'Target Deals & Coupons', 'Save with Target deals and promotions.'),
('Apple', 'apple', 'Premium technology company known for iPhone, Mac, iPad, and accessories.', 4.7, 20000, 'from-gray-600 to-gray-700', true, 'Apple Deals & Coupons', 'Find deals on Apple products.'),
('Dyson', 'dyson', 'Innovative home appliance brand known for vacuums and hair care products.', 4.5, 5000, 'from-purple-600 to-purple-700', true, 'Dyson Deals & Coupons', 'Save on Dyson vacuums and products.'),
('Adidas', 'adidas', 'Global sportswear brand offering athletic shoes, clothing, and accessories.', 4.4, 7500, 'from-gray-800 to-black', true, 'Adidas Deals & Coupons', 'Find Adidas shoe and apparel deals.'),
('Walmart', 'walmart', 'America''s largest retailer with everyday low prices on everything.', 4.2, 25000, 'from-blue-500 to-blue-600', true, 'Walmart Deals & Coupons', 'Save with Walmart everyday low prices.'),
('Costco', 'costco', 'Membership warehouse club offering bulk products at wholesale prices.', 4.6, 8000, 'from-red-600 to-red-700', true, 'Costco Deals & Coupons', 'Find Costco warehouse deals.'),
('Macy''s', 'macys', 'Iconic department store offering fashion, home goods, and beauty products.', 4.1, 6500, 'from-red-500 to-red-600', true, 'Macy''s Deals & Coupons', 'Save on fashion at Macy''s.'),
('Nordstrom', 'nordstrom', 'Upscale department store known for designer fashion and excellent service.', 4.5, 5500, 'from-gray-800 to-gray-900', true, 'Nordstrom Deals & Coupons', 'Find Nordstrom fashion deals.'),
('Home Depot', 'home-depot', 'Largest home improvement retailer with tools, appliances, and building materials.', 4.4, 11000, 'from-orange-500 to-orange-600', true, 'Home Depot Deals & Coupons', 'Save on home improvement.'),
('Lowe''s', 'lowes', 'Home improvement retailer offering tools, appliances, and outdoor products.', 4.3, 9500, 'from-blue-600 to-blue-700', true, 'Lowe''s Deals & Coupons', 'Find home improvement deals.'),
('Wayfair', 'wayfair', 'Online furniture and home goods retailer with millions of products.', 4.2, 7000, 'from-purple-500 to-purple-600', true, 'Wayfair Deals & Coupons', 'Save on furniture and home decor.'),
('IKEA', 'ikea', 'Swedish furniture retailer known for affordable modern home furnishings.', 4.3, 8000, 'from-blue-500 to-yellow-500', true, 'IKEA Deals & Coupons', 'Find affordable furniture deals.'),
('Sephora', 'sephora', 'Leading beauty retailer offering makeup, skincare, and fragrance.', 4.5, 6000, 'from-gray-900 to-black', true, 'Sephora Deals & Coupons', 'Save on beauty products.'),
('Samsung', 'samsung', 'Global technology leader in smartphones, TVs, and home appliances.', 4.4, 12000, 'from-blue-700 to-blue-800', true, 'Samsung Deals & Coupons', 'Find Samsung electronics deals.'),
('Dell', 'dell', 'Leading computer manufacturer offering laptops, desktops, and monitors.', 4.2, 7500, 'from-blue-600 to-blue-700', true, 'Dell Deals & Coupons', 'Save on Dell computers and laptops.'),
('Sony', 'sony', 'Global electronics company known for PlayStation, TVs, and audio equipment.', 4.5, 9000, 'from-gray-800 to-black', true, 'Sony Deals & Coupons', 'Find Sony electronics deals.'),
('Bose', 'bose', 'Premium audio brand known for headphones, speakers, and sound systems.', 4.6, 5500, 'from-gray-700 to-gray-800', true, 'Bose Deals & Coupons', 'Save on Bose audio products.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  color = EXCLUDED.color,
  updated_at = NOW();

-- Insert categories
INSERT INTO categories (name, slug, description, display_order, is_active, meta_title, meta_description) VALUES
('Electronics', 'electronics', 'Deals on TVs, laptops, smartphones, tablets, and all tech gadgets.', 1, true, 'Electronics Deals', 'Find the best electronics deals.'),
('Fashion', 'fashion', 'Clothing, shoes, and accessories deals from top brands.', 2, true, 'Fashion Deals', 'Save on clothing and accessories.'),
('Home & Kitchen', 'home-kitchen', 'Home appliances, furniture, cookware, and home decor deals.', 3, true, 'Home & Kitchen Deals', 'Find home and kitchen deals.'),
('Laptops', 'laptops', 'Laptop deals from Apple, Dell, HP, Lenovo, and more.', 4, true, 'Laptop Deals', 'Compare laptop prices and save.'),
('Headphones', 'headphones', 'Wireless headphones, earbuds, and audio equipment deals.', 5, true, 'Headphone Deals', 'Find the best headphone deals.'),
('Sneakers', 'sneakers', 'Athletic shoes and sneaker deals from Nike, Adidas, and more.', 6, true, 'Sneaker Deals', 'Save on sneakers and shoes.'),
('TVs', 'tvs', 'TV deals on OLED, QLED, and 4K smart TVs.', 7, true, 'TV Deals', 'Compare TV prices and save.'),
('Smartphones', 'smartphones', 'iPhone, Samsung Galaxy, and Android phone deals.', 8, true, 'Smartphone Deals', 'Find smartphone deals.'),
('Smartwatches', 'smartwatches', 'Apple Watch, Galaxy Watch, and fitness tracker deals.', 9, true, 'Smartwatch Deals', 'Save on smartwatches.'),
('Gaming', 'gaming', 'Video game console, gaming laptop, and accessory deals.', 10, true, 'Gaming Deals', 'Find gaming deals.'),
('Beauty', 'beauty', 'Skincare, makeup, and beauty product deals.', 11, true, 'Beauty Deals', 'Save on beauty products.'),
('Fitness', 'fitness', 'Workout equipment, fitness trackers, and gym gear deals.', 12, true, 'Fitness Deals', 'Find fitness equipment deals.'),
('Outdoor', 'outdoor', 'Camping, hiking, and outdoor gear deals.', 13, true, 'Outdoor Deals', 'Save on outdoor gear.'),
('Kitchen Appliances', 'kitchen-appliances', 'Air fryers, coffee makers, and kitchen gadget deals.', 14, true, 'Kitchen Appliance Deals', 'Find kitchen appliance deals.'),
('Vacuums', 'vacuums', 'Robot vacuums, cordless vacuums, and cleaning device deals.', 15, true, 'Vacuum Deals', 'Compare vacuum prices.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- Insert sample coupons
INSERT INTO coupons (store_slug, code, title, description, discount_type, discount_value, is_verified, is_exclusive, is_active, success_rate) VALUES
('amazon', 'SAVE10', '10% Off Your First Order', 'Save 10% on your first Amazon order when you sign up for Prime.', 'percentage', 10, true, false, true, 85),
('amazon', 'FREESHIP', 'Free Shipping on Orders $25+', 'Get free shipping on qualifying orders over $25.', 'free_shipping', null, true, false, true, 95),
('best-buy', 'TECH20', '20% Off Select Electronics', 'Save 20% on select TVs, laptops, and tablets.', 'percentage', 20, true, true, true, 78),
('best-buy', 'MEMBER15', '15% Off for My Best Buy Members', 'Exclusive 15% discount for loyalty members.', 'percentage', 15, true, true, true, 82),
('nike', 'JUST25', '25% Off Full-Price Items', 'Save 25% on full-price sneakers and apparel.', 'percentage', 25, true, false, true, 72),
('nike', 'MEMBER20', '20% Off for Nike Members', 'Exclusive member discount on all products.', 'percentage', 20, true, true, true, 88),
('target', 'CIRCLE15', '15% Off with Target Circle', 'Save 15% when you join Target Circle for free.', 'percentage', 15, true, false, true, 90),
('target', 'PICKUP5', '$5 Off Drive Up Orders', 'Get $5 off your first Drive Up or Order Pickup.', 'fixed', 5, true, false, true, 75),
('apple', 'STUDENT10', '10% Education Discount', 'Students and educators save 10% on Mac and iPad.', 'percentage', 10, true, false, true, 95),
('dyson', 'CLEAN20', '20% Off Vacuums', 'Save 20% on select Dyson vacuums.', 'percentage', 20, true, true, true, 70),
('adidas', 'SPORT30', '30% Off Outlet Items', 'Extra 30% off already reduced outlet items.', 'percentage', 30, true, false, true, 85),
('adidas', 'ADICLUB', '15% Off for adiClub Members', 'Join adiClub for 15% off your first order.', 'percentage', 15, true, false, true, 92),
('walmart', 'PICKUP10', '$10 Off First Pickup Order', 'Save $10 on your first grocery pickup.', 'fixed', 10, true, false, true, 88),
('samsung', 'GALAXY15', '15% Off Galaxy Devices', 'Save 15% on select Galaxy phones and tablets.', 'percentage', 15, true, true, true, 75),
('dell', 'EXTRA10', '10% Off Laptops', 'Extra 10% off select XPS and Inspiron laptops.', 'percentage', 10, true, false, true, 80),
('sony', 'AUDIO20', '20% Off Headphones', 'Save 20% on Sony WH-1000XM5 and more.', 'percentage', 20, true, true, true, 78),
('bose', 'SOUND15', '15% Off Speakers', 'Save 15% on Bose portable speakers.', 'percentage', 15, true, false, true, 82),
('sephora', 'BEAUTY20', '20% Off for Beauty Insiders', 'Exclusive 20% off during VIB Rouge sale.', 'percentage', 20, true, true, true, 70),
('home-depot', 'PRO10', '10% Off for Pro Members', 'Pro Xtra members save 10% on select items.', 'percentage', 10, true, true, true, 85),
('wayfair', 'WAY15', '15% Off First Order', 'New customers save 15% on their first order.', 'percentage', 15, true, false, true, 88)
ON CONFLICT DO NOTHING;
