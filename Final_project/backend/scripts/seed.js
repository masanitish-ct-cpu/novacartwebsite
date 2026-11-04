require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const products = [
  // Electronics
  { name: 'NovaPhone X1 Pro', description: 'Flagship smartphone with 6.7" AMOLED display, 108MP camera, 5000mAh battery and 5G connectivity.', category: 'Electronics', brand: 'NovaTech', price: 69999, originalPrice: 79999, discount: 13, stock: 25, rating: 4.6, numReviews: 128, featured: true, isNewArrival: true, images: [img('photo-1511707171634-5f897ff02aa9'), img('photo-1592899677977-9c10ca588bbd')] },
  { name: 'AeroBook 14 Laptop', description: 'Thin and light laptop with Intel i7, 16GB RAM, 512GB SSD and 14" FHD display.', category: 'Electronics', brand: 'Aero', price: 84999, originalPrice: 94999, discount: 11, stock: 12, rating: 4.5, numReviews: 86, featured: true, images: [img('photo-1496181133206-80ce9b88a853'), img('photo-1525547719571-a2d4ac8945e2')] },
  { name: 'SoundPulse Wireless Headphones', description: 'Over-ear Bluetooth headphones with active noise cancellation and 40h battery life.', category: 'Electronics', brand: 'Pulse', price: 7999, originalPrice: 12999, discount: 38, stock: 40, rating: 4.4, numReviews: 210, featured: false, isNewArrival: true, images: [img('photo-1505740420928-5e560c06d30e')] },
  { name: 'SmartWatch Series 5', description: 'Fitness and health smartwatch with heart-rate, SpO2, GPS and 7-day battery.', category: 'Electronics', brand: 'NovaTech', price: 14999, originalPrice: 19999, discount: 25, stock: 30, rating: 4.3, numReviews: 95, images: [img('photo-1523275335684-37898b6baf30')] },
  { name: '4K Ultra HD Smart TV 55"', description: '55-inch 4K UHD smart TV with HDR10, Dolby Audio and built-in streaming apps.', category: 'Electronics', brand: 'VisionX', price: 42999, originalPrice: 54999, discount: 22, stock: 8, rating: 4.7, numReviews: 64, images: [img('photo-1593359677879-a4bb92f829d1')] },
  { name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with deep bass and 12h playtime.', category: 'Electronics', brand: 'Pulse', price: 2499, originalPrice: 3999, discount: 38, stock: 60, rating: 4.2, numReviews: 140, images: [img('photo-1608043152269-423dbba4e7e1')] },

  // Fashion
  { name: 'Classic Denim Jacket', description: 'Premium washed denim jacket with a relaxed fit and vintage finish.', category: 'Fashion', brand: 'DenimCo', price: 2999, originalPrice: 4499, discount: 33, stock: 35, rating: 4.4, numReviews: 72, featured: true, images: [img('photo-1551028719-00167b16eac5')] },
  { name: 'Minimalist White T-Shirt', description: '100% organic cotton crew-neck t-shirt, soft and breathable.', category: 'Fashion', brand: 'PureWear', price: 799, originalPrice: 1299, discount: 38, stock: 100, rating: 4.1, numReviews: 230, images: [img('photo-1521572163474-6864f9cf17ab')] },
  { name: 'Slim Fit Chino Pants', description: 'Stretch chino pants with a modern slim fit, ideal for work or casual.', category: 'Fashion', brand: 'UrbanFit', price: 1899, originalPrice: 2799, discount: 32, stock: 45, rating: 4.3, numReviews: 58, images: [img('photo-1473966968600-fa801b869a1a')] },
  { name: 'Floral Summer Dress', description: 'Lightweight floral print dress perfect for warm weather.', category: 'Fashion', brand: 'Bloom', price: 2299, originalPrice: 3499, discount: 34, stock: 28, rating: 4.5, numReviews: 41, isNewArrival: true, images: [img('photo-1595777457583-95e059d581b8')] },
  { name: 'Leather Belt', description: 'Genuine leather belt with brushed steel buckle.', category: 'Fashion', brand: 'Craft', price: 999, originalPrice: 1499, discount: 33, stock: 70, rating: 4.0, numReviews: 33, images: [img('photo-1624222247344-550fb60583dc')] },

  // Footwear
  { name: 'AeroRun Running Shoes', description: 'Lightweight running shoes with responsive foam cushioning.', category: 'Footwear', brand: 'Aero', price: 3499, originalPrice: 4999, discount: 30, stock: 50, rating: 4.6, numReviews: 180, featured: true, images: [img('photo-1542291026-7eec264c27ff')] },
  { name: 'Classic Leather Sneakers', description: 'Everyday white leather sneakers with rubber sole.', category: 'Footwear', brand: 'Stride', price: 2799, originalPrice: 3999, discount: 30, stock: 40, rating: 4.4, numReviews: 92, images: [img('photo-1549298916-b41d501d3772')] },
  { name: 'Urban Chelsea Boots', description: 'Suede chelsea boots with elastic side panels.', category: 'Footwear', brand: 'UrbanFit', price: 4599, originalPrice: 6499, discount: 29, stock: 18, rating: 4.5, numReviews: 47, images: [img('photo-1608256246200-53e635b5b65f')] },
  { name: 'Comfort Sandals', description: 'Ergonomic sandals with adjustable straps for all-day comfort.', category: 'Footwear', brand: 'Stride', price: 1299, originalPrice: 1999, discount: 35, stock: 55, rating: 4.1, numReviews: 66, images: [img('photo-1603487742131-4160ec999306')] },

  // Accessories
  { name: 'Leather Wallet', description: 'Slim bifold leather wallet with RFID protection.', category: 'Accessories', brand: 'Craft', price: 1499, originalPrice: 2299, discount: 35, stock: 60, rating: 4.3, numReviews: 88, images: [img('photo-1627123424574-724758594e93')] },
  { name: 'Aviator Sunglasses', description: 'UV400 polarized aviator sunglasses with metal frame.', category: 'Accessories', brand: 'Shade', price: 1999, originalPrice: 2999, discount: 33, stock: 45, rating: 4.4, numReviews: 74, featured: true, images: [img('photo-1572635196237-14b3f281503f')] },
  { name: 'Canvas Backpack', description: 'Durable canvas backpack with laptop compartment.', category: 'Accessories', brand: 'Trail', price: 2499, originalPrice: 3499, discount: 29, stock: 38, rating: 4.5, numReviews: 59, images: [img('photo-1553062407-98eeb64c6a62')] },
  { name: 'Stainless Steel Watch', description: 'Analog quartz watch with stainless steel band.', category: 'Accessories', brand: 'TimeX', price: 3999, originalPrice: 5999, discount: 33, stock: 22, rating: 4.6, numReviews: 40, images: [img('photo-1524592094714-0f0654e20314')] },
  { name: 'Wireless Earbuds', description: 'True wireless earbuds with touch controls and 24h total battery.', category: 'Accessories', brand: 'Pulse', price: 3299, originalPrice: 4999, discount: 34, stock: 50, rating: 4.2, numReviews: 112, isNewArrival: true, images: [img('photo-1590658268037-6bf12165a8df')] },

  // Home & Living
  { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic mugs in earthy tones.', category: 'Home & Living', brand: 'HomeCraft', price: 1299, originalPrice: 1899, discount: 32, stock: 40, rating: 4.5, numReviews: 63, images: [img('photo-1514228742587-6b1558fcca3d')] },
  { name: 'Aromatherapy Diffuser', description: 'Ultrasonic essential oil diffuser with 7-color LED and auto shut-off.', category: 'Home & Living', brand: 'Calm', price: 1799, originalPrice: 2699, discount: 33, stock: 35, rating: 4.4, numReviews: 48, images: [img('photo-1608571423902-eed4a5ad8108')] },
  { name: 'Throw Blanket', description: 'Soft fleece throw blanket, cozy and warm.', category: 'Home & Living', brand: 'CozyHome', price: 1599, originalPrice: 2499, discount: 36, stock: 42, rating: 4.3, numReviews: 55, images: [img('photo-1580301762395-21ce84d00bc6')] },
  { name: 'Desk Lamp LED', description: 'Adjustable LED desk lamp with 3 brightness levels and USB charging.', category: 'Home & Living', brand: 'Lumina', price: 1199, originalPrice: 1799, discount: 33, stock: 50, rating: 4.2, numReviews: 39, images: [img('photo-1507473885765-e6ed057f782c')] },

  // Beauty
  { name: 'Vitamin C Serum', description: 'Brightening vitamin C serum for radiant, even-toned skin.', category: 'Beauty', brand: 'GlowLab', price: 899, originalPrice: 1499, discount: 40, stock: 60, rating: 4.6, numReviews: 145, featured: true, images: [img('photo-1620916566398-39f1143ab7be')] },
  { name: 'Matte Lipstick Set', description: 'Set of 6 long-lasting matte lipsticks in trending shades.', category: 'Beauty', brand: 'LipLuxe', price: 1299, originalPrice: 1999, discount: 35, stock: 45, rating: 4.3, numReviews: 88, images: [img('photo-1586495777744-4413f21062fa')] },
  { name: 'Hydrating Face Cream', description: 'Daily moisturizer with hyaluronic acid for all skin types.', category: 'Beauty', brand: 'GlowLab', price: 699, originalPrice: 1099, discount: 36, stock: 70, rating: 4.4, numReviews: 102, images: [img('photo-1556228720-195a672e8a03')] },
  { name: 'Perfume Eau de Parfum', description: 'Long-lasting floral fragrance, 50ml.', category: 'Beauty', brand: 'Scent', price: 2499, originalPrice: 3799, discount: 34, stock: 30, rating: 4.5, numReviews: 57, images: [img('photo-1541643600914-78b084683601')] },

  // Sports
  { name: 'Yoga Mat Premium', description: 'Non-slip 6mm thick yoga mat with carrying strap.', category: 'Sports', brand: 'FlexFit', price: 1499, originalPrice: 2299, discount: 35, stock: 40, rating: 4.5, numReviews: 76, images: [img('photo-1601925260368-ae2f83cf8b7f')] },
  { name: 'Adjustable Dumbbells Set', description: 'Pair of adjustable dumbbells, 2-24kg each.', category: 'Sports', brand: 'IronCore', price: 8999, originalPrice: 12999, discount: 31, stock: 12, rating: 4.7, numReviews: 34, featured: true, images: [img('photo-1583454110551-21f2fa2afe61')] },
  { name: 'Cricket Bat English Willow', description: 'Professional grade English willow cricket bat.', category: 'Sports', brand: 'PlayHard', price: 6499, originalPrice: 8999, discount: 28, stock: 15, rating: 4.4, numReviews: 28, images: [img('photo-1531415074968-036ba1b575da')] },
  { name: 'Badminton Racket Pro', description: 'Lightweight graphite badminton racket for advanced players.', category: 'Sports', brand: 'Smash', price: 2799, originalPrice: 3999, discount: 30, stock: 25, rating: 4.3, numReviews: 41, images: [img('photo-1626224583764-f87db24ac4ea')] },
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(products);
  await User.create({
    name: 'Admin User',
    email: 'admin@novacart.com',
    password: 'Admin@123',
    role: 'admin',
  });
  await User.create({
    name: 'Demo User',
    email: 'user@novacart.com',
    password: 'User@123',
    role: 'user',
  });
  console.log(`Seeded ${products.length} products`);
  console.log('Admin: admin@novacart.com / Admin@123');
  console.log('User: user@novacart.com / User@123');
};

if (require.main === module) {
  seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = seed;
