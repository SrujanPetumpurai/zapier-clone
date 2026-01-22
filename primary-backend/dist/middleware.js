import Jwt from "jsonwebtoken";
export function authMiddleware(req, res, next) {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).json({
            message: "sigin before continuing"
        });
    }
    const token = authheader.split(" ")[1];
    if (!token) {
        return res.status(400).json({
            message: 'singin please'
        });
    }
    if (!process.env.JWT_PASSWORD) {
        throw new Error("Couldn't find the JWT PASSWORD (SRY)");
    }
    try {
        const payload = Jwt.verify(token, process.env.JWT_PASSWORD);
        //@ts-ignore
        req.id = payload.id;
        next();
    }
    catch (e) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }
}
//# sourceMappingURL=middleware.js.map