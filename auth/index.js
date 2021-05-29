require('dotenv').config();
const { SECRET } = process.env;
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        //Authorization: "bearer jlkjsldkjsldkfjsldfjsl"
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload = await jwt.verify(token, SECRET);
            if (payload) {
                req.payload = payload;
                next();
            } else {
                console.log('VERIFICATION FAILED OR NO PAYLOAD');
                res.status(400).json({
                    error: 'VERIFICATION FAILED OR NO PAYLOAD',
                });
            }
        } else {
            console.log('NO AUTHORIZATION HEADER');
            res.status(400).json({ error: 'NO AUTHORIZATION HEADER' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};

module.exports = auth;
