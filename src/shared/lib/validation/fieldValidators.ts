export interface ValidationError {
  field: string;
  message: string;
}

// Валидация имени для регистрации (более строгая)
export const validateNameForRegistration = (
  name: string
): ValidationError | null => {
  if (!name || name.trim().length === 0) {
    return { field: "name", message: "Введите имя" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { field: "name", message: "Имя должно содержать минимум 2 символа" };
  }

  if (trimmedName.length > 50) {
    return { field: "name", message: "Имя не должно превышать 50 символов" };
  }

  return null;
};

// Валидация имени для профиля (более гибкая)
export const validateNameForProfile = (
  name: string
): ValidationError | null => {
  if (!name || name.trim().length === 0) {
    return { field: "name", message: "Имя обязательно для заполнения" };
  }

  const trimmedName = name.trim();

  // Проверяем, что имя состоит из 1-2 слов
  const words = trimmedName.split(/\s+/);
  if (words.length > 2) {
    return {
      field: "name",
      message: "Имя должно содержать не более двух слов",
    };
  }

  // Проверяем, что каждое слово содержит только буквы, дефисы и апострофы
  const nameRegex = /^[а-яёА-ЯЁa-zA-Z\-']+$/;
  for (const word of words) {
    if (!nameRegex.test(word)) {
      return {
        field: "name",
        message: "Имя может содержать только буквы, дефисы и апострофы",
      };
    }
  }

  // Проверяем длину имени
  if (trimmedName.length < 2) {
    return { field: "name", message: "Имя должно содержать минимум 2 символа" };
  }

  if (trimmedName.length > 50) {
    return { field: "name", message: "Имя не должно превышать 50 символов" };
  }

  return null;
};

// Валидация email (общая)
export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim().length === 0) {
    return { field: "email", message: "Email обязателен для заполнения" };
  }

  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { field: "email", message: "Неверный email" };
  }

  if (trimmedEmail.length > 100) {
    return {
      field: "email",
      message: "Email не должен превышать 100 символов",
    };
  }

  return null;
};

// Валидация пароля
export const validatePassword = (password: string): ValidationError | null => {
  if (!password || password.length === 0) {
    return { field: "password", message: "Пароль обязателен для заполнения" };
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  if (!passwordRegex.test(password)) {
    return {
      field: "password",
      message: "Минимум 6 символов, 1 заглавная буква, 1 цифра",
    };
  }

  return null;
};

// Валидация подтверждения пароля
export const validatePasswordConfirm = (
  password: string,
  confirm: string
): ValidationError | null => {
  if (!confirm || confirm.length === 0) {
    return { field: "confirm", message: "Подтвердите пароль" };
  }

  if (password !== confirm) {
    return { field: "confirm", message: "Пароли не совпадают" };
  }

  return null;
};

// Валидация телефона
export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone || phone.trim().length === 0) {
    return null; // Телефон не обязателен
  }

  const trimmedPhone = phone.trim();

  // Удаляем все символы кроме цифр, +, -, (, ), пробелов
  const cleanPhone = trimmedPhone.replace(/[^\d+\-() ]/g, "");

  // Проверяем, что остались только цифры и допустимые символы
  if (!/^[\d+\-() ]+$/.test(cleanPhone)) {
    return {
      field: "phone",
      message: "Телефон может содержать только цифры, +, -, (, ) и пробелы",
    };
  }

  // Проверяем длину (минимум 10 цифр)
  const digitsOnly = cleanPhone.replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    return {
      field: "phone",
      message: "Телефон должен содержать минимум 10 цифр",
    };
  }

  if (digitsOnly.length > 15) {
    return { field: "phone", message: "Телефон не должен превышать 15 цифр" };
  }

  return null;
};

// Валидация адреса
export const validateAddress = (address: string): ValidationError | null => {
  if (!address || address.trim().length === 0) {
    return null; // Адрес не обязателен
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.length > 200) {
    return {
      field: "address",
      message: "Адрес не должен превышать 200 символов",
    };
  }

  return null;
};

// Валидация формы профиля
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateProfileForm = (formData: {
  name: string;
  email: string;
  phone: string;
  address: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateNameForProfile(formData.name);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push(emailError);

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.push(phoneError);

  const addressError = validateAddress(formData.address);
  if (addressError) errors.push(addressError);

  return {
    isValid: errors.length === 0,
    errors,
  };
};
