import { Request, Response, NextFunction } from "express";
import { auth } from "../database/firebaseConfig";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) return res.status(401).json({ message: "Não Autorizado" });
    
    const user = await auth.verifyIdToken(authToken);
    if (!user) return res.status(401).json({ message: "Não Autorizado" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro Interno no Servidor" });
  }
};
