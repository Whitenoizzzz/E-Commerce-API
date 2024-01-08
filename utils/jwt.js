const jwt = require('jsonwebtoken')

const createJWT = ({payload}) =>{
    const token  = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : process.env.JWT_LIFETIME});
    return token;
}

// This function makes a cookie to send back to the user instead of the 
// the sending token in response. This is much better than storing the token
// in local storage in frontend. And secondly, once you send a cookie, browser
// itself attaches in it response to every req send to the server.
const attachCookiesToResponse = ({res,user}) =>{
    const token = createJWT({payload : user})

    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token',token, {
        httpOnly : true,
        expires: new Date( Date.now() + oneDay),
        secured : process.env.NODE_ENV === 'production',
        signed : 'true'
    })
}

const isTokenValid = ({token}) => jwt.verify(token,process.env.JWT_SECRET);

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}