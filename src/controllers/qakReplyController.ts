import { RequestHandler } from "express";
import { QakReply } from "../models/qakReply";
import { verifyUser } from "../services/auth";
import { User } from "../models/user";

export const getQakReply: RequestHandler = async (req, res, next) => {
  let user_id = req.params.user_id;
  let userFound = await QakReply.findByPk(user_id, {
    attributes: { exclude: ["password"] },
    include: [{ all: true, nested: true }]
  });
  if (userFound) {
    const serializedUser = userFound.toJSON();
    res.status(200).json(serializedUser);
  } else {
    res.status(404).json({});
  }
};

export const createQakReply: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (!user) {
    return res.status(403).send("Unauthorized");
  }

  let newQakReply: QakReply = req.body;
  newQakReply.user_id = user.user_id;

  if (newQakReply.qakReply) {
    let created = await QakReply.create(newQakReply);
    res.status(201).json(created);
  } else {
    res.status(400).send("Bad Request");
  }
};

export const getOneQakReply: RequestHandler = async (req, res, next) => {
  let qakReply_id = req.params.qakReply_id;
  let qakReplyFound = await QakReply.findByPk(qakReply_id);
  if (qakReplyFound) {
    res.status(200).json(qakReplyFound);
  } else {
    res.status(404).json({});
  }
};

export const updateQakReply: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    let qakReply_id = req.params.qakReply_id;
    let updatedQakReply: QakReply = req.body;

    if (!updatedQakReply.qakReply) {
      res.status(400).json("QAK Reply should not be empty");
    }

    let qakReplyFound = await QakReply.findByPk(qakReply_id);

    if (qakReplyFound) {
      if (qakReplyFound.user_id == user.user_id) {
        await QakReply.update(updatedQakReply, {
          where: { qakReply_id: qakReply_id }
        });
        res.status(200).json(updatedQakReply);
      } else {
        res.status(403).json("Not Authorized");
      }
    } else {
      res.status(404).json("QAK Replay Not Found");
    }
  } else {
    res.status(401).json("Not Logged in");
  }
};

export const deleteQakReply: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    let qakReply_id = req.params.id;

    let qakReplyFound = await QakReply.findByPk(qakReply_id);

    if (qakReplyFound) {
      if (qakReplyFound.user_id == user.user_id) {
        await qakReplyFound.destroy();

        res.status(200).json("QAK Reply Deleted");
      } else {
        res.status(403).json("Not Authorized");
      }
    } else {
      res.status(404).json("Qak Reply Not found");
    }
  } else {
    res.status(401).json("Not Logged in");
  }
};
