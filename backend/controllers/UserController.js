import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const getUsers = async(req, res) => {
    try {
        const users = await UserModel.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
export const getUser = async(req, res) => {
    try {
        const users = await UserModel.findOne({
            where: {
                email: req.params.email
            }
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}


export const register = async(req, res) => {
    const {name, email, password, confPassword} = req.body;
    if (password !== confPassword ) return res.status(400).json({
        msg: "Password dan Confirm Password tidak sama"
    });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hashPassword
        });

        res.json({msg: "Register Berhasil"});
    } catch (error) {
        console.log(error);
    }
}



export const login = async (req, res) => {

    try {
        const user = await UserModel.findOne({
            where:{
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({msg: "wrong password"});
        
        const userId = user.id;
        const email = user.email;
        const name = user.name;
        
        
        // res.json(process.env.ACCESS_TOKEN_SECRET);

        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        await user.update({
            refresh_token: refreshToken
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true, ini untuk https 
        });

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: `User tidak ditemukan  ${error}`});
    }
}

export const logout = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);

        const user = await UserModel.findOne({
            where: {
                refresh_token: refreshToken
            }
        });

        if(!user) return res.sendStatus(204);

        await user.update({
            refresh_token: null
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);

    } catch (error) {
        
    }
}

