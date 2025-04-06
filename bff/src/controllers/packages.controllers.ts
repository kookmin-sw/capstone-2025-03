import { Request, Response } from "express";
import { getMergedPackages } from "../services/packages.service";

export const getPackages = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;

    try {
        const data = await getMergedPackages(page, pageSize);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};
