const { z } = require('zod');

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
};
