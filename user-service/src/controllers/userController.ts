import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { IUser } from "../models/User";

export = {
  signupController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const user = await userService.addUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
  sendOTPController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const user = await userService.addUserData(userData);
      if (!user) next(new Error("User not found"));
      await userService.sendOTP(user?.email);
      res.status(200).send("OTP sent successfully");
    } catch (error) {
      next(error);
    }
  },
  verifyOTPController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const otpData: { _id: string; otp: string } = req.body;
      await userService.verifyOTP(otpData._id, otpData.otp);
      res.status(200).send("OTP verified successfully");
    } catch (error) {
      next(error);
    }
  },
  loginController: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const loginData: { username: string; password: string } = req.body;
      const userData: IUser = await userService.verifyLogin(
        loginData.username,
        loginData.password
      );

      if (!userData) next(new Error("User doesn't exist"));

      const token = await userService.generateJWT(userData._id);
      res.cookie("token", token);
      res.status(200).json({ userData, message: "Logged in successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
