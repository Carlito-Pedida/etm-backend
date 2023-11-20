import { RequestHandler } from "express";
import { Qak } from "../models/qak";
import { verifyUser } from "../services/auth";
import { User } from "../models/user";

export const getAllQaks: RequestHandler = async (req, res, next) => {
  let qaks = await Qak.findAll({
    attributes: { exclude: ["password"] },
    include: [{ all: true, nested: true }]
  });

  res.status(200).json(qaks);
};

export const createQak: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (!user) {
    return res.status(403).send("Unauthorized");
  }

  let newQak: Qak = req.body;
  newQak.user_id = user.user_id;

  if (newQak.qak) {
    let created = await Qak.create(newQak);
    res.status(201).json(created);
  } else {
    res.status(400).send("Bad Request");
  }
};

export const getOneQak: RequestHandler = async (req, res, next) => {
  let qak_id = req.params.qak_id;
  let qakFound = await Qak.findByPk(qak_id);
  if (qakFound) {
    res.status(200).json(qakFound);
  } else {
    res.status(404).json({});
  }
};

export const updateQak: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    let qak_id = req.params.qak_id;
    let updatedQak: Qak = req.body;

    if (!updatedQak.qak) {
      res.status(400).json("QAK should not be empty");
    }

    let qakFound = await Qak.findByPk(qak_id);

    if (qakFound) {
      if (qakFound.user_id == user.user_id) {
        await Qak.update(updatedQak, {
          where: { qak_id: qak_id }
        });
        res.status(200).json(updatedQak);
      } else {
        res.status(403).json("Not Authorized");
      }
    } else {
      res.status(404).json("QAK Not found");
    }
  } else {
    res.status(401).json("Not Logged in");
  }
};

export const deleteQak: RequestHandler = async (req, res, next) => {
  let user: User | null = await verifyUser(req);

  if (user) {
    let qak_id = req.params.id;

    let qakFound = await Qak.findByPk(qak_id);

    if (qakFound) {
      if (qakFound.user_id == user.user_id) {
        await qakFound.destroy();

        res.status(200).json("QAK Deleted");
      } else {
        res.status(403).json("Not Authorized");
      }
    } else {
      res.status(404).json("Qak Not found");
    }
  } else {
    res.status(401).json("Not Logged in");
  }
};
