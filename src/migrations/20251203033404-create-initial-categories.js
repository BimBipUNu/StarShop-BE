'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Categories', [{
                name: 'Electronics',
                icon: 'electronics-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Books',
                icon: 'books-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Clothing',
                icon: 'clothing-icon',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};
