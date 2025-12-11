require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // --- 1. TẠO USERS ---
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@starshop.com',
        password: hashedPassword,
        phone: '1234567890',
        address: '123 Admin St',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Regular User',
        email: 'user@starshop.com',
        password: hashedPassword,
        phone: '0987654321',
        address: '456 User Ave',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    // Lấy ID của User thường để dùng cho Cart và Order
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM Users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const regularUserId = users.find(u => u.email === 'user@starshop.com')?.id;

    // --- 2. TẠO CATEGORIES ---
    await queryInterface.bulkInsert('Categories', [
      { name: 'Electronics', icon: 'mobile-alt', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Accessories', icon: 'headphones', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM Categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const elecId = categories.find(c => c.name === 'Electronics')?.id;
    const accId = categories.find(c => c.name === 'Accessories')?.id;

    // --- 3. TẠO PRODUCTS ---
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Smartphone X',
        description: 'Flagship phone 2024',
        categoryId: elecId,
        price: 999.00,
        image: 'https://via.placeholder.com/300?text=Smartphone+X',
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Wireless Headphones',
        description: 'Noise cancelling',
        categoryId: accId,
        price: 150.00,
        image: 'https://via.placeholder.com/300?text=Headphones',
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Laptop Gaming Z',
        description: 'High performance for gamers',
        categoryId: elecId,
        price: 2000.00,
        image: 'https://via.placeholder.com/300?text=Laptop+Gaming',
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    const products = await queryInterface.sequelize.query(
      `SELECT id, name, price FROM Products;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const phone = products.find(p => p.name === 'Smartphone X');
    const headphone = products.find(p => p.name === 'Wireless Headphones');
    const laptop = products.find(p => p.name === 'Laptop Gaming Z');

    // --- 4. TẠO CART & CART ITEMS (MỚI) ---
    if (regularUserId) {
      // A. Tạo Giỏ hàng cho User
      await queryInterface.bulkInsert('Carts', [{
        userId: regularUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});

      const cart = await queryInterface.sequelize.query(
        `SELECT id FROM Carts WHERE userId = ${regularUserId} LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (cart.length > 0) {
        const cartId = cart[0].id;

        // B. Thêm sản phẩm vào giỏ (Giả lập tình huống thực tế)
        await queryInterface.bulkInsert('CartItems', [
          {
            cartId: cartId,
            productId: phone.id,
            quantity: 1,
            total: phone.price * 1, // Tổng tiền item
            isSelected: true, // <--- ĐANG ĐƯỢC CHỌN (Sẽ được thanh toán)
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            cartId: cartId,
            productId: headphone.id,
            quantity: 2,
            total: headphone.price * 2,
            isSelected: false, // <--- KHÔNG ĐƯỢC CHỌN (Để lại sau)
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            cartId: cartId,
            productId: laptop.id,
            quantity: 1,
            total: laptop.price * 1,
            isSelected: true, // <--- ĐANG ĐƯỢC CHỌN
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ], {});
      }
    }

    // --- 5. TẠO ORDERS (Lịch sử mua hàng cũ) ---
    // (Logic cũ giữ nguyên để có data lịch sử)
    if (regularUserId && phone && headphone) {
        // ... (Code tạo Order cũ của bạn có thể giữ nguyên ở đây nếu muốn)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa theo thứ tự ngược lại (Con trước -> Cha sau)
    await queryInterface.bulkDelete('CartItems', null, {});
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
// require('dotenv').config();
// const bcrypt = require('bcrypt');

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // 1. TẠO USERS (Giữ nguyên)
//     const hashedPassword = await bcrypt.hash('password123', 10);

//     await queryInterface.bulkInsert('Users', [
//       {
//         name: 'Admin User',
//         email: 'admin@starshop.com',
//         password: hashedPassword,
//         phone: '1234567890',
//         address: '123 Admin St',
//         role: 'admin',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Regular User',
//         email: 'user@starshop.com',
//         password: hashedPassword,
//         phone: '0987654321',
//         address: '456 User Ave',
//         role: 'user',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});

//     const regularUser = await queryInterface.sequelize.query(
//       `SELECT id FROM Users WHERE email = 'user@starshop.com' LIMIT 1;`,
//       { type: Sequelize.QueryTypes.SELECT }
//     );

//     // 2. TẠO CATEGORIES (MỚI THÊM)
//     // Phải tạo danh mục trước để lấy ID gắn vào sản phẩm
//     await queryInterface.bulkInsert('Categories', [
//       {
//         name: 'Electronics',
//         icon: 'mobile-alt', // Ví dụ icon
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Accessories',
//         icon: 'headphones',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }
//     ], {});

//     // Lấy ID của các danh mục vừa tạo
//     const categories = await queryInterface.sequelize.query(
//       `SELECT id, name FROM Categories;`,
//       { type: Sequelize.QueryTypes.SELECT }
//     );

//     // Tìm ID tương ứng để dùng
//     // (Dùng optional chaining ?.id đề phòng lỗi nếu không tìm thấy)
//     const elecId = categories.find(c => c.name === 'Electronics')?.id;
//     const accId = categories.find(c => c.name === 'Accessories')?.id;

//     // 3. TẠO PRODUCTS (ĐÃ SỬA)
//     await queryInterface.bulkInsert('Products', [
//       {
//         name: 'Smartphone X',
//         description: 'Latest model smartphone with advanced features.',
//         categoryId: elecId,
//         price: 999.99,
//         image: 'http://example.com/smartphone_x.jpg',
//         stock: 100,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//       {
//         name: 'Wireless Headphones',
//         description: 'High-quality wireless headphones with noise cancellation.',
//         categoryId: accId, // <-- Thay thế category: 'Accessories'
//         price: 149.99,
//         image: 'http://example.com/headphones.jpg', // <-- Đổi imageUrl thành image
//         stock: 250,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     ], {});

//     // 4. TẠO ORDERS (Giữ nguyên logic)
//     const product1 = await queryInterface.sequelize.query(
//       `SELECT id FROM Products WHERE name = 'Smartphone X' LIMIT 1;`,
//       { type: Sequelize.QueryTypes.SELECT }
//     );
//     const product2 = await queryInterface.sequelize.query(
//       `SELECT id FROM Products WHERE name = 'Wireless Headphones' LIMIT 1;`,
//       { type: Sequelize.QueryTypes.SELECT }
//     );

//     if (regularUser.length > 0 && product1.length > 0 && product2.length > 0) {
//       const order = await queryInterface.bulkInsert('Orders', [
//         {
//           userId: regularUser[0].id,
//           totalAmount: (999.99 * 1) + (149.99 * 2),
//           status: 'pending',
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       ], {});

//       const orderId = await queryInterface.sequelize.query(
//         `SELECT id FROM Orders WHERE userId = ${regularUser[0].id} LIMIT 1;`,
//         { type: Sequelize.QueryTypes.SELECT }
//       );

//       if (orderId.length > 0) {
//         await queryInterface.bulkInsert('OrderItems', [
//           {
//             orderId: orderId[0].id,
//             productId: product1[0].id,
//             quantity: 1,
//             price: 999.99,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           },
//           {
//             orderId: orderId[0].id,
//             productId: product2[0].id,
//             quantity: 2,
//             price: 149.99,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           },
//         ], {});
//       }
//     }
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Xóa theo thứ tự ngược lại để tránh lỗi khóa ngoại
//     await queryInterface.bulkDelete('OrderItems', null, {});
//     await queryInterface.bulkDelete('Orders', null, {});
//     await queryInterface.bulkDelete('Products', null, {});
//     await queryInterface.bulkDelete('Categories', null, {});
//     await queryInterface.bulkDelete('Users', null, {});
//   }
// };
