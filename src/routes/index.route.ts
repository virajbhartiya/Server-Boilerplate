import authRouter from "./auth.route";
import usersRouter from "./user.route";
import passport from "passport";

export const routes = (app: any) => {
  app.use("/api/auth", authRouter);
  app.use(
    "/api/users",
    passport.authenticate("jwt", { session: false }),
    usersRouter
  );
};
