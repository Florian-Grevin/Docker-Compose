const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        password: {
            type: 'varchar',
        },
        refreshToken: {
            type: 'varchar',
            nullable: true,
        },
        role: {
            type: 'varchar',
            default: 'user',
        },
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
    },
});
