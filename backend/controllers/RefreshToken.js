import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

export const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);

        const user = await UserModel.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) return res.sendStatus(403);
            
            const userId = user.id;
            const name = user.name;
            const email = user.email;


            const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({accessToken});
        });

    } catch (error) {
        console.log(error);
    }
}