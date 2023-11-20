import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Request } from "express";

const secret = "Peace be with you";

export const hashPassword = async (plainTextPassword: string) => {
  const saltRound = 12;
  const hash = await bcrypt.hash(plainTextPassword, saltRound);
  return hash;
};

export const comparePasswords = async (
  plainTextPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const signUserToken = async (user: User) => {
  let token = jwt.sign(
    {
      user_id: user.user_id,
      fullname: user.fullname,
      profilePicture: user.profilePicture
    },
    secret,
    { expiresIn: "1hr" }
  );

  return token;
};

export const verifyUser = async (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      let decoded: any = await jwt.verify(token, secret);
      //console.log(secret);
      return User.findByPk(decoded.user_id);
    } catch (err) {
      return null;
    }
  } else {
    return null;
  }
};
