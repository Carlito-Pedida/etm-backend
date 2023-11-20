import { RequestHandler } from "express";
import { User } from "../models/user";
import {
  hashPassword,
  comparePasswords,
  signUserToken,
  verifyUser
} from "../services/auth";

export const getAllUsers: RequestHandler = async (req, res, next) => {
  let users = await User.findAll({
    attributes: { exclude: ["password"] },
    include: [{ all: true, nested: true }]
  });
  res.status(200).json(users);
};

export const createUser: RequestHandler = async (req, res, next) => {
  let newUser: User = req.body;
  if (newUser.username && newUser.password) {
    let hashedPassword = await hashPassword(newUser.password);
    newUser.password = hashedPassword;
    let created = await User.create(newUser);
    res.status(201).json({
      user_id: created.user_id,
      fullname: created.fullname,
      username: created.username,
      email: created.email,
      city: created.city
    });
  } else {
    res.status(400).send("Please complete all required fields");
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  let existingUser: User | null = await User.findOne({
    where: { username: req.body.username }
  });

  if (existingUser) {
    let passwordsMatch = await comparePasswords(
      req.body.password,
      existingUser.password
    );

    if (passwordsMatch) {
      let token = await signUserToken(existingUser);
      res.status(200).json({ token });
    } else {
      res.status(401).json("Invalid password");
    }
  } else {
    res.status(401).json("Invalid username");
  }
};

export const getOneProfile: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      email: user.email,
      city: user.city,
      state: user.state,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    });
  } else {
  }
  res.status(401).json();
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  let reqId = parseInt(req.params.id);

  if (user && user.user_id === reqId) {
    let {
      user_id,
      username,
      fullname,
      password,
      email,
      city,
      state,
      profilePicture
    } = user;
    res.status(200).json({
      user_id,
      username,
      fullname,
      password,
      email,
      city,
      state,
      profilePicture
    });
  } else {
    res.status(401).send();
  }
};

export const getUserQaks: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    let posts = await User.findByPk(user.user_id, {
      include: [{ all: true, nested: true }]
    });
    res.status(200).json(posts);
  } else {
    res.status(404).json();
  }
};

export const getOneUserQak: RequestHandler = async (req, res, next) => {
  let user_id = req.params.user_id;
  let userFound = await User.findByPk(user_id, {
    include: [{ all: true, nested: true }]
  });
  if (userFound) {
    res.status(200).json(userFound);
  } else {
    res.status(404).json({});
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const user: User | null = await verifyUser(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const reqId = parseInt(req.params.id);

  if (user.user_id !== reqId) {
    return res
      .status(403)
      .send("Forbidden: You can only update your own profile.");
  }

  const updatedProfileData = req.body;

  try {
    await User.update(updatedProfileData, {
      where: { user_id: reqId }
    });

    const updatedUser = await User.findByPk(reqId);

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  const user: User | null = await verifyUser(req);

  if (user) {
    let user_id = req.params.user_id;
    let updatedProfile: User = req.body;
    if (updatedProfile.username && updatedProfile.password) {
      let hashedPassword = await hashPassword(updatedProfile.password);
      updatedProfile.password = hashedPassword;

      updatedProfile.user_id = user.user_id;

      let userFound = await User.findByPk(user_id);

      userFound &&
        userFound.user_id == updatedProfile.user_id &&
        updatedProfile.fullname &&
        updatedProfile.city &&
        updatedProfile.state &&
        updatedProfile.profilePicture;
      {
        await User.update(updatedProfile, {
          where: { user_id: parseInt(user_id) }
        });
      }
      res.status(200).json(updatedProfile);
    }
  } else {
    res.status(400).json();
  }
};
