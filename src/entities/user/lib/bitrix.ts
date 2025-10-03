import { updateBitrixContact } from "@/src/shared/api";

interface UserBitrixData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

/**
 * Синхронизирует данные пользователя с Битрикс24
 * Не выбрасывает ошибки, только логирует
 */
export async function syncUserToBitrix(
  bitrixId: string,
  userData: UserBitrixData
): Promise<void> {
  console.log("Обновление контакта в Битрикс24...");

  const bitrixData = {
    NAME: userData.name,
    EMAIL: [{ VALUE: userData.email, VALUE_TYPE: "WORK" as const }],
    ...(userData.phone && {
      PHONE: [{ VALUE: userData.phone, VALUE_TYPE: "WORK" as const }],
    }),
    ...(userData.address && { ADDRESS: userData.address }),
  };

  const result = await updateBitrixContact(bitrixId, bitrixData);

  if (!result.ok) {
    console.error("Ошибка обновления в Битрикс24:", result.error);
  } else {
    console.log("✅ Контакт успешно обновлен в Битрикс24");
  }
}
