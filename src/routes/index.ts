import authRouter from "./Auth";
import usersRouter from "./User";
import passport from "passport";

export const routes = (app: any) => {
  app.use("/api/auth", authRouter);
  app.use(
    "/api/users",
    passport.authenticate("jwt", { session: false }),
    usersRouter
  );
};
