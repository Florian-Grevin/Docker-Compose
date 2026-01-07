const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../../config/data-source');
const User = require('../../entities/User');
const env = require('../../config/env');

class AuthService {
    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(email, password) {
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw { statusCode: 409, message: 'Email already in use' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        });

        await this.userRepository.save(user);
        return { id: user.id, email: user.email };
    }

    async login(email, password) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw { statusCode: 401, message: 'Invalid credentials' };
        }

        return this.generateTokens(user);
    }

    async refreshToken(token) {
        try {
            const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
            const user = await this.userRepository.findOneBy({ id: payload.id });

            if (!user || user.refreshToken !== token) {
                throw { statusCode: 401, message: 'Invalid refresh token' };
            }

            return this.generateTokens(user);
        } catch (error) {
            throw { statusCode: 401, message: 'Invalid refresh token' };
        }
    }

    async generateTokens(user) {
        const accessToken = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        });

        const refreshToken = jwt.sign({ id: user.id }, env.REFRESH_TOKEN_SECRET, {
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
        });

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        return { accessToken, refreshToken };
    }
}

module.exports = new AuthService();
