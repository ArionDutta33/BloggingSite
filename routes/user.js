const { storeReturnTo }=require("../middleware")
const express = require("express")
const router = express.Router()
const ExpressError = require("../utils/ExpressError")
const Async = require("../utils/Async")
const User = require("../models/user")
const passport = require("passport")

router.get("/register", (req, res) => {
   
    res.render("authform/register")
})
router.post("/register", Async(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser,err=>{
            if(err) return next
            res.redirect("/blogs")
        })
    } catch (e) {
        res.redirect("/register")
    }
}))
router.get("/login", (req, res) => {
    res.render("authform/login")
})

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {   failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        
        const redirectUrl = res.locals.returnTo || '/blogs'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });







// router.post("/login",storeReturnTo, passport.authenticate("local", { failureRedirect: "/login" }), Async(async (req, res) => {
//     const redirectUrl=req.session.returnTo|| "/blogs"
//     req.session.returnTo;
//     res.redirect(redirectUrl)
// }))
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        res.redirect('/blogs');
    });
});
module.exports = router