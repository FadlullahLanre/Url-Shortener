const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const AppError = require('../utils/appError');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = catchAsync(async (user, statusCode, res) => {
    const token = signToken(user._id);

    user.loggedOut = false;
    await user.save({ validateBeforeSave: false });

    user.password = undefined;
    user.active = undefined;
    user.confirmEmailToken = undefined;
    user.loggedOut = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user,
        },
    });
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

const signup = catchAsync(async (req, res, next) => {
    const user = await User.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password

    });
    user.save((err, user) => {
        if (err) {
            return next(new AppError(err, 500));
        }
        res.status(200).json({
            user,
            message: 'Sign up succesful!! Please confirm your email',
        });
    });
    
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password +active');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    if (user.active !== true) {
        return next(
            new AppError('Inactive, check email for confirmation link', 401)
        );
    }
    createSendToken(user, 200, res);
});


const protect = catchAsync(async (req, res, next) => {
    //1). Getting token and check if its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access', 401)
        );
    }

    //2). Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3). Checek if user still exists
    const currentUser = await User.findById(decoded.id).select('+loggedOut');
    if (!currentUser) {
        return next(new AppError('The user no longer exists', 401));
    }
    //4). Check if user is logged in
    if (currentUser.loggedOut) {
        return next(
            new AppError('You are not logged in! Please log in to get access', 401)
        );
    }

    req.user = currentUser;
    next();
});

const logout = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        email: req.user.email,
    });
    user.loggedOut = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: 'You have successfully logged out',
    });
});

module.exports = {
    signup,
    login,
    protect,
    logout,
};
