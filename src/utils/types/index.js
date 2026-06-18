const TransactionType = {
  EARN: "earn",
  CONVERT: "convert",
};

const MethodType = {
  INSTAPAY: "instapay",
  WALLET: "wallet",
};

const MaterialType = {
  PLASTIC: "plastic",
  CAN: "can",
};

const GenderType = {
  MALE: "male",
  FEMALE: "female",
};

const TokenType = {
  ACCESS: "access",
  REFRESH: "refresh",
};
const RoleType = {
  USER: "user",
  ADMIN: "admin",
};
const ConversionStatus = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
};

// Used for temporary test override — forces machine to treat item as a specific material
const OverrideMode = {
  CAN: "can",
  PLASTIC: "plastic",
  AUTO: "auto", // disables override and uses AI model result
};



export {
  TransactionType,
  MethodType,
  MaterialType,
  GenderType,
  TokenType,
  RoleType,
  ConversionStatus,
  OverrideMode,
};
