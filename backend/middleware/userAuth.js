import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const {token} = req.cookies; // trying to find the token that is stored in the cookie

    if(!token) {
        return res.json({success: false, message: 'Not Authorized. Login Again'})
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET); // verify the token using jwt.verify method and storing in tokenDecode

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        } else {
            return res.json({success: false, message: 'Not Authorized. Login Again'});
        }

        next(); // if the token is valid, call the next middleware or route handler or executing controller function

    } catch (error) {
        res.json({success: false, message: '--error in userAuth middleware' + error.message});
    }
}

export default userAuth; // export the userAuth middleware to use in the routes
// This middleware will be used to protect the routes that require authentication