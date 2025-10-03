import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/src/shared/lib/auth";
import {
  validateUpdateProfileData,
  createSafeUserResponse,
  ERROR_MESSAGES,
  syncUserToBitrix,
} from "@/src/entities/user";
import {
  getUserById,
  updateUser,
} from "@/src/entities/user/api/userRepository";

interface UpdateProfileRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

/**
 * Обработчик для обновления профиля пользователя
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { name, email, phone, address } = req.body as UpdateProfileRequest;

  // Валидация данных
  const validation = validateUpdateProfileData(name, email);
  if (!validation.isValid) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    // Получаем текущего пользователя
    const currentUser = getUserById(req.user.userId);
    if (!currentUser) {
      return res
        .status(401)
        .json({ ok: false, error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    // Обновляем данные в локальной БД
    const updatedUser = updateUser(req.user.userId, {
      login: name,
      email,
      phone: phone || null,
      address: address || null,
    });

    if (!updatedUser) {
      return res
        .status(400)
        .json({ ok: false, error: ERROR_MESSAGES.PROFILE_UPDATE_FAILED });
    }

    // Обновляем контакт в Битрикс24, если есть bitrixId
    if (currentUser.bitrixId) {
      await syncUserToBitrix(currentUser.bitrixId, {
        name,
        email,
        phone,
        address,
      });
    }

    console.log("✅ Профиль успешно обновлен:", updatedUser.id);

    return res.status(200).json({
      ok: true,
      user: createSafeUserResponse(updatedUser),
    });
  } catch (error: any) {
    console.error("❌ Update profile error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || ERROR_MESSAGES.UPDATE_PROFILE_ERROR,
    });
  }
}

export default withAuth(handler);
