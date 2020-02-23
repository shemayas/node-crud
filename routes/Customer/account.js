var express = require('express');
var app = express();
var router = express.Router();
var User = require('../../models/user');

/**
 * Get main account page
 */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/customer/account/login');
    }

    return res.render('customer/account', {template: 'account', title: 'החשבון שלי'});
});

router.get('/register', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/customer/account');
    }

    res.render('customer/register', {template: 'register', title: 'רישום'});
});

//POST route for updating data
router.post('/register', function (req, res, next) {
    // confirm that user typed same password twice
    let params = req.body;
    if (params.password !== params.passwordRepeat) {
        req.url = '/register';
        req.method = 'GET';
        res.locals.errMessage = 'Passwords do not match.';
        return router.handle(req, res, next);
    }

    if (params.email &&
        params.username &&
        params.password) {

        var userData = {
            email: params.email,
            username: params.username,
            password: params.password,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

router.get('/login', function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/customer/account');
    }

    return res.render('customer/login', {layout: 'default', template: 'login', title: 'כניסה'});
});

router.post('/login', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        res.status(400).locals.errMessage = 'Please set email and password';
        req.url = '/login';
        req.method = 'GET';
        return router.handle(req, res, next)
    }

    User.authenticate(email, password, function (error, user) {
        if (error || !user) {
            var err = new Error('Wrong email or password.');
            err.status = 401;
            return next(err);
        } else {
            req.session.user = user;
            return res.redirect('/customer/account');
        }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;