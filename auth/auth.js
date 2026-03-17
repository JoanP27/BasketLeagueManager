import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';


dotenv.config()

const secreto = process.env.SECRETO;

export const generarToken = (login) => {
    return jwt.sign({login: login}, secreto, {expiresIn: '2 hours'})
}

export const validarToken = token => {
    try {
        const result = jwt.verify(token, process.env.SECRETO)
        return result;
    }catch(ex) {
        console.error(ex.message)
    }
}

export const protegerRuta = roles => {
    return (req, res, next) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith("Bearer "))
        token = token.slice(7);

    const result = validarToken(token)

    if (result && roles.includes(result.login.rol))
        next();
    else
        res.send({ok: false, error: "Usuario no autorizado"});
}}