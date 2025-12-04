// require('dotenv').config();
// const bcrypt = require('bcrypt');

// module.exports = {
//     up: async(queryInterface, Sequelize) => {
//         const hashedPassword = await bcrypt.hash('password123', 10);

//         await queryInterface.bulkInsert('Users', [{
//                 name: 'Admin User',
//                 email: 'admin@starshop.com',
//                 password: hashedPassword,
//                 phone: '1234567890',
//                 address: '123 Admin St',
//                 role: 'admin',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//             {
//                 name: 'Regular User',
//                 email: 'user@starshop.com',
//                 password: hashedPassword,
//                 phone: '0987654321',
//                 address: '456 User Ave',
//                 role: 'user',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//         ], {});

//         const adminUser = await queryInterface.sequelize.query(
//             `SELECT id FROM Users WHERE email = 'admin@starshop.com' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
//         );
//         const regularUser = await queryInterface.sequelize.query(
//             `SELECT id FROM Users WHERE email = 'user@starshop.com' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
//         );

//         await queryInterface.bulkInsert('Products', [{
//                 name: 'Smartphone X',
//                 description: 'Latest model smartphone with advanced features.',
//                 category: 'Electronics',
//                 price: 999.99,
//                 imageUrl: 'http://example.com/smartphone_x.jpg',
//                 stock: 100,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//             {
//                 name: 'Wireless Headphones',
//                 description: 'High-quality wireless headphones with noise cancellation.',
//                 category: 'Accessories',
//                 price: 149.99,
//                 imageUrl: 'http://example.com/headphones.jpg',
//                 stock: 250,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//         ], {});

//         // Create a sample order for the regular user
//         const product1 = await queryInterface.sequelize.query(
//             `SELECT id FROM Products WHERE name = 'Smartphone X' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
//         );
//         const product2 = await queryInterface.sequelize.query(
//             `SELECT id FROM Products WHERE name = 'Wireless Headphones' LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
//         );

//         if (regularUser.length > 0 && product1.length > 0 && product2.length > 0) {
//             const order = await queryInterface.bulkInsert('Orders', [{
//                 userId: regularUser[0].id,
//                 totalAmount: (999.99 * 1) + (149.99 * 2), // 1 Smartphone X + 2 Wireless Headphones
//                 status: 'pending',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             }, ], {});

//             const orderId = await queryInterface.sequelize.query(
//                 `SELECT id FROM Orders WHERE userId = ${regularUser[0].id} LIMIT 1;`, { type: Sequelize.QueryTypes.SELECT }
//             );

//             if (orderId.length > 0) {
//                 await queryInterface.bulkInsert('OrderItems', [{
//                         orderId: orderId[0].id,
//                         productId: product1[0].id,
//                         quantity: 1,
//                         price: 999.99,
//                         createdAt: new Date(),
//                         updatedAt: new Date(),
//                     },
//                     {
//                         orderId: orderId[0].id,
//                         productId: product2[0].id,
//                         quantity: 2,
//                         price: 149.99,
//                         createdAt: new Date(),
//                         updatedAt: new Date(),
//                     },
//                 ], {});
//             }
//         }
//     },

//     down: async(queryInterface, Sequelize) => {
//         await queryInterface.bulkDelete('OrderItems', null, {});
//         await queryInterface.bulkDelete('Orders', null, {});
//         await queryInterface.bulkDelete('Products', null, {});
//         await queryInterface.bulkDelete('Users', null, {});
//     }
// };
require('dotenv').config();
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. TẠO USERS (Giữ nguyên)
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

    const regularUser = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'user@starshop.com' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // 2. TẠO CATEGORIES (MỚI THÊM)
    // Phải tạo danh mục trước để lấy ID gắn vào sản phẩm
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Electronics',
        icon: 'mobile-alt', // Ví dụ icon
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Accessories',
        icon: 'headphones',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    // Lấy ID của các danh mục vừa tạo
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM Categories;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Tìm ID tương ứng để dùng
    // (Dùng optional chaining ?.id đề phòng lỗi nếu không tìm thấy)
    const elecId = categories.find(c => c.name === 'Electronics')?.id;
    const accId = categories.find(c => c.name === 'Accessories')?.id;

    // 3. TẠO PRODUCTS (ĐÃ SỬA)
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Smartphone X',
        description: 'Latest model smartphone with advanced features.',
        categoryId: elecId,
        price: 999.99,
        image: 'http://example.com/smartphone_x.jpg',
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        categoryId: accId, // <-- Thay thế category: 'Accessories'
        price: 149.99,
        image: 'http://example.com/headphones.jpg', // <-- Đổi imageUrl thành image
        stock: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    // 4. TẠO ORDERS (Giữ nguyên logic)
    const product1 = await queryInterface.sequelize.query(
      `SELECT id FROM Products WHERE name = 'Smartphone X' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const product2 = await queryInterface.sequelize.query(
      `SELECT id FROM Products WHERE name = 'Wireless Headphones' LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (regularUser.length > 0 && product1.length > 0 && product2.length > 0) {
      const order = await queryInterface.bulkInsert('Orders', [
        {
          userId: regularUser[0].id,
          totalAmount: (999.99 * 1) + (149.99 * 2),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});

      const orderId = await queryInterface.sequelize.query(
        `SELECT id FROM Orders WHERE userId = ${regularUser[0].id} LIMIT 1;`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (orderId.length > 0) {
        await queryInterface.bulkInsert('OrderItems', [
          {
            orderId: orderId[0].id,
            productId: product1[0].id,
            quantity: 1,
            price: 999.99,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            orderId: orderId[0].id,
            productId: product2[0].id,
            quantity: 2,
            price: 149.99,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ], {});
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa theo thứ tự ngược lại để tránh lỗi khóa ngoại
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
