import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/src/shared/lib/auth";
import { createSafeUserResponse, ERROR_MESSAGES } from "@/src/entities/user";
import { getUserById } from "@/src/entities/user/api/userRepository";

/**
 * Обработчик для получения текущего пользователя
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const user = getUserById(req.user.userId);

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(200).json({
      ok: true,
      user: createSafeUserResponse(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json({ ok: false, error: ERROR_MESSAGES.SERVER_ERROR });
  }
}

export default withAuth(handler);
