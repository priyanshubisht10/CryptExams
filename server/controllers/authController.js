import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Admin from '../models/adminModel.js';
import createSendToken from '../middleware/jwt.js'
import { cookieOptions } from '../middleware/cookieOptions.js';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

export const registerAdmin = catchAsync(async (req, res, next) => {
   const adminBody = {
      adminName: req.body.adminName,
      adminInstituteId: req.body.adminInstituteId,
      email: req.body.adminEmail,
      password: req.body.password,
      adminId: req.body.adminId,
      medium: req.body.medium,
      subject: req.body.subject
   };

   const newAdmin = await Admin.create(adminBody);

   if (!newAdmin) {
      return next(new AppError('Could not register the Admin', 400));
   }

   const token = createSendToken(newAdmin._id, process.env.JWT_SECRET_ADMIN);
   res.cookie('jwt', token, cookieOptions);

   newAdmin.password = undefined; //remove passwords

   res.status(200).json({
      status: 'success',
      token,
      data: {
         newAdmin,
      },
   });

});

export const loginAdmin = catchAsync(async (req, res, next) => {

   const { adminId, password } = req.body;

   if (!adminId || !password) {
      return next(new AppError('Please provide ID and password!', 400));
   }

   const admin = await Admin.findOne({ adminId }).select('+password');

   if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return next(new AppError('Incorrect email or password!'));
   }

   const token = createSendToken(admin._id, process.env.JWT_SECRET_ADMIN);
   res.cookie('jwt', token, cookieOptions);

   admin.password = undefined; //remove passwords

   res.status(200).json({
      status: 'success',
      token,
      data: {
         admin,
      },
   });
});

export const protectAdmin = catchAsync(async (req, res, next) => {
   let token;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      token = req.headers.authorization.split(' ')[1];
   }

   if (!token) {
      return next(new AppError('You are not logged in!'), 401);
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_ADMIN);

   const currentAdmin = await Admin.findById(decoded.id);
   if (!currentAdmin) {
      return next(
         new AppError('Admin not found for the corresponding token!', 401)
      );
   }

   req.admin = currentAdmin;
   next();
})







