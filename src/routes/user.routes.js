import { Router } from "express";
import {
    loginUser, 
    logoutUser,
    registerUser,
    changeUserDetails,
    changeUserPassword,
    getCurrentUser,
    refreshAccessToken,
    deleteUserAccount,
    replaceUserDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, 
    changeUserPassword
)
router.route("/current-user").get(verifyJWT,
    getCurrentUser
)
router.route("/update-account").patch(verifyJWT,
    changeUserDetails
)
router.route("/replace-account").put(verifyJWT,
    replaceUserDetails
)
router.route("/delete-account").delete(verifyJWT,
    deleteUserAccount
)

export default router