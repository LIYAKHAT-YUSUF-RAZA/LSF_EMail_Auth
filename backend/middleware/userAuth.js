import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    let token = null;
    
    // Try to get token from cookies first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    
    // If no cookie token, try Authorization header
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
        }
    }

    if(!token) {
        return res.json({success: false, message: 'Not Authorized. Login Again'})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        } else {
            return res.json({success: false, message: 'Not Authorized. Login Again'});
        }

        next();

    } catch (error) {
        res.json({success: false, message: '--error in userAuth middleware' + error.message});
    }
}

export default userAuth;