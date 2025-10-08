import * as userService from "./userService.js";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const { user, token, refreshToken } = await userService.loginUser(
      email,
      password
    );

    // set refres token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge:
        Number(process.env.JWT_REFRESH_EXPIRES_MS) || 7 * 24 * 3600 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken: token,
      user: {
        user_uuid: user.user_uuid,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: error.message || "Unauthorized" });
  }
}

export async function refreshToken(req, res) {
  try {
    const refresh = req.cookies?.refreshToken || req.body?.refresh;
    if (!refresh)
      return res.status(400).json({ message: "Refresh token is required" });

    const { accessToken, refreshToken: newRefresh } =
      await userService.refreshTokens(refresh);

    //set refres token cookie
    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      secure: true,
      maxAge:
        Number(process.env.JWT_REFRESH_EXPIRES_MS) || 7 * 24 * 3600 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    return res
      .status(401)
      .json({ message: error.message || "Invalid or expired refresh token" });
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export const updateUser = async (req, res) => {
  try {
    const userUuid = req.params.id;
    // ensuring user is changing it's own password
    if (req.user.user_uuid !== userUuid && !req.user.isAdmin) {
      return res.status(403).json({ message: "This is not your account" });
    }
    const user = await userService.updateUser(userUuid, req.body);
    return res.json({ message: "User updated", user });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export async function changePassword(req, res) {
  try {
    console.log("PASS", { params: req.params, body: req.body });

    const userUuid = req.params.id;
    // ensuring user is changing it's own password
    if (req.user.user_uuid !== userUuid && !req.user.isAdmin) {
      return res.status(403).json({ message: "This is not your account" });
    }
    const updated = await userService.changePassword(
      userUuid,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.json({ message: "Password updated", updated });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
    // next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const userUuid = req.params.id;
    if (req.user.user_uuid !== userUuid) {
      return res.status(403).json({ message: "This is not your account" });
    }
    await userService.deleteUser(userUuid);
    res.status(204).end("user deleted");
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  // clear cookie
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}
