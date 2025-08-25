import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    let user;

    try {
        await session.withTransaction(async () => {
            const { name, email, password } = req.body;

            if ("isAdmin" in req.body) {
                const err = new Error("isAdmin cannot be set at signup");
                err.statusCode = 400;
                throw err;
            }

            // Check existence inside the txn
            const existing = await User.findOne({ email }).session(session);
            if (existing) {
                const error = new Error("User already exists");
                error.statusCode = 409;
                throw error;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user but add another safeguard for admin permission
            user = await User.create(
                { name, email, password: hashedPassword, isAdmin: false },
                { session }
            );

            // Create profile
            await Profile.create(
                { user: user._id, bio: "", avatarUrl: "" },
                { session }
            );
            //set write concern to majority to prevent crashes and data loss
        }, { readConcern: { level: "local" }, writeConcern: { w: "majority" } });

        // Send response after txn succeeds
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                      // true in prod (HTTPS)
            sameSite: isProd ? "none" : "lax",   // "none" for cross-site prod
            maxAge: 1000 * 60 * 60,              // 1h
            // domain: ".yourdomain.com",        // if using subdomains app./api.
        });


        res.status(201).json({
            success: true,
            message: "User successfully created!",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        next(error);
    } finally {
        session.endSession();
    }
};

export const signIn = async (req, res, next) => {
    try{

        const{ email, password } = req.body;

        if ('isAdmin' in req.body) {
            const err = new Error('isAdmin cannot be set at sign-in');
            err.statusCode = 400;
            throw err;
        }

        const user = await User.findOne({email});

        if(!user){
             const error = new Error('User not found');
             error.statusCode = 404;
             throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId:user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                      // true in prod (HTTPS)
            sameSite: isProd ? "none" : "lax",   // "none" for cross-site prod
            maxAge: 1000 * 60 * 60,              // 1h
            // domain: ".yourdomain.com",        // if using subdomains app./api.
        });

// then your JSON response (omit password)
        return res.status(200).json({
            success: true,
            message: "Signed in",
            data: { user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } }
        });


    }catch(error){
        next(error);

    }

};

export const signOut = async (req, res, next) => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            // domain: ".yourdomain.com",
        });
        return res.status(200).json({ success: true, message: "Signed out" });
    } catch (err) {
        next(err);
    }
};

