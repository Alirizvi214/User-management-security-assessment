// isLoggedIn , isLoggedOut
// isAdmin

// const jwt = require('jsonwebtoken')
// const jwtSecret = process.env.JWT_SECRET

module.exports = {
    
    isLoggedIn: (req,res,next) => {
        if(req.user && req.isAuthenticated()){
            // console.log(req);
            // console.log(req.isUnauthenticated());
            next()
        }else {
            // req.flash('error', 'Not Authorized')
            res.redirect('/login')
        }
    },
    isAdminLoggedIn: (req, res, next) => {
        if (req.isAuthenticated() && req.user && req.user.isAdmin === true) {
            next();
        } else {
            // If a logged-in user is not admin, destroy session and redirect
            if (req.isAuthenticated() && req.user && !req.user.isAdmin) {
                req.logout(() => {
                    req.session.destroy(() => {
                        res.redirect('/admin/login');
                    });
                });
            } else {
                res.redirect('/admin/login');
            }
        }
    },
    isLoggedOut: (req,res,next) => {
        if(req.isAuthenticated() && req.user){
            res.redirect('/')
        }else{
            next()
        }
    },
    isAdminLoggedOut: (req,res,next) => {
        if(req.isAuthenticated() && req.user.isAdmin){
            res.redirect('/admin')
        }else{
            next()
        }
    },
    // isAdmin: (req,res,next) => {
    //     const token = req.cookies.jwt
    //     if(token){
    //         jwt.verify(token, jwtSecret, (err, decodedToken) => {
    //             if(err){
    //                 // return res.status(401).json({message: 'Not Authorized'})
    //                 req.flash('error', 'Not Authorized')
    //                 res.redirect('/admin/login')
    //             } else {
    //                 if(decodedToken.role !== 'Admin') {
    //                     // return res.status(401).json({message: 'Not Authorized'})
    //                     req.flash('error', 'Not Authorized')
    //                     res.redirect('/admin/login')
    //                 }else{
    //                     next()
    //                 }
    //             }
    //         })
    //     }else {
    //         res.redirect('/admin/login')
    //     }
    // },
    // isUser: (req,res,next) => {
    //     const token = req.cookies.jwt
    //     if(token){
    //         jwt.verify(token, jwtSecret, (err, decodedToken) => {
    //             if(err){
    //                 // return res.status(401).json({message: 'Not Authorized'})
    //                 req.flash('error', 'Not Authorized')
    //                 res.redirect('/login')
    //             } else {
    //                 if(decodedToken.role !== 'User') {
    //                     // return res.status(401).json({message: 'Not Authorized'})
    //                     req.flash('error', 'Not Authorized')
    //                     res.redirect('/login')
    //                 }else{
    //                     next()
    //                 }
    //             }
    //         })
    //     }
    // },
}