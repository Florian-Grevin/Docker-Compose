const authService = require('./auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await authService.register(email, password);
            res.status(201).json({
                status: 'success',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            // 👉 AJOUT DU COOKIE HTTP
            res.cookie("accessToken", result.accessToken, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
});

res.cookie("refreshToken", result.refreshToken, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});


            // 👉 Réponse JSON comme avant
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }


    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    getProfile(req, res) {
        res.json({
            status: 'success',
            data: req.user,
        });
    }
}

module.exports = new AuthController();
