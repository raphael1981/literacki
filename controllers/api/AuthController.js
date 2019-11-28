const User = require("../../models/index").User
const Password = require("../../helpers/password")
const secret = require('../../config/secret');
const jwt = require('jsonwebtoken');

class AuthController {

    login(req, res) {
        // return res.json(req.query)
        var data = req.body;
        User.findOne({
            email: data.login
        })
            .then((u) => {
                // return res.json(u)
                if (u) {
                    Password.comparePassword(data.password, u.password)
                        .then((bool) => {

                            if (bool) {
                                var tm = ((1000 * 60) * 60)

                                jwt.sign({
                                    user: u
                                },
                                    secret, {
                                    expiresIn: tm
                                },
                                    (err, token) => {

                                        res.cookie('authToken', token, {
                                            maxAge: tm,
                                            httpOnly: true
                                        });
                                        // return res.status(200).json({ success: true, token: token });
                                        return res.json({
                                            success: true
                                        })


                                    });


                            } else {
                                return res.json({
                                    success: false
                                })
                            }

                        })
                } else {
                    return res.json({
                        success: false
                    })
                }
            })
    }

    checkLogin(req, res) {

        let cookies = req.cookies;

        if (cookies.authToken) {

            let auth = jwt.verify(cookies.authToken, secret)

            if (!auth) {
                // return res.json({
                //     success: true
                // });
                return res.json({
                    success: false
                });
            } else {
                return res.json({
                    success: true
                });
            }

        } else {
            return res.json({
                success: true
            });
            return res.json({
                success: false
            });
        }


    }


    logout(req, res) {
        return res.clearCookie('authToken').json({
            clear: true
        })
    }


}

module.exports = new AuthController();