import { Router } from "express";
import { getCurrentUser, handleSocialLogin, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { userLoginValidator, userRegisterValidator } from "../validators/user.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import passport from "../passport/index.js";
const router = Router();

// Unsecured route
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/loggedInUser").get(verifyJWT, getCurrentUser);
// SSO routes
router.route("/google").get(
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
    (req, res) => {
      res.send("redirecting to google...");
    }
  );
  
  router.route("/github").get(
    passport.authenticate("github", {
      scope: ["profile", "email"],
    }),
    (req, res) => {
      res.send("redirecting to github...");
    }
  );
  
  router
    .route("/google/callback")
    .get(passport.authenticate("google"), handleSocialLogin);
  
  router
    .route("/github/callback")
    .get(passport.authenticate("github"), handleSocialLogin);
  
export default router;
