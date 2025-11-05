import { z } from "zod";

// -------- Number / Integer / Float --------
export const preprocessInt = (msg = "Invalid integer") =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return undefined;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({ required_error: msg, invalid_type_error: msg }).int(msg));

export const preprocessIntOptional = (msg = "Invalid integer") =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return undefined;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().int(msg).optional());

export const preprocessDouble = (msg = "Invalid number") =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return undefined;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({ required_error: msg, invalid_type_error: msg }));

export const preprocessDoubleOptional = (msg = "Invalid number") =>
  z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return undefined;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().optional());

// -------- String --------
export const preprocessString = (msg = "Invalid string") =>
  z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string({ required_error: msg, invalid_type_error: msg }).min(1, msg)
  );

export const preprocessStringOptional = (msg = "Invalid string") =>
  z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().min(1, msg).optional()
  );

// -------- Boolean --------
export const preprocessBoolean = (msg = "Invalid boolean") =>
  z.preprocess((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      if (["true", "1", "yes"].includes(lower)) return true;
      if (["false", "0", "no"].includes(lower)) return false;
    }
    if (typeof val === "number") return val === 1;
    return undefined;
  }, z.boolean({ required_error: msg, invalid_type_error: msg }));

export const preprocessBooleanOptional = (msg = "Invalid boolean") =>
  z.preprocess((val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.toLowerCase().trim();
      if (["true", "1", "yes"].includes(lower)) return true;
      if (["false", "0", "no"].includes(lower)) return false;
    }
    if (typeof val === "number") return val === 1;
    return undefined;
  }, z.boolean().optional());

// -------- Enum --------
export const preprocessEnum = (values, msg = "Invalid value") =>
  z.enum(values, { required_error: msg, invalid_type_error: msg });

export const preprocessEnumOptional = (values, msg = "Invalid value") =>
  z.enum(values, { invalid_type_error: msg }).optional();

// -------- Date --------
export const preprocessDate = (msg = "Invalid date") =>
  z.preprocess((val) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date({ required_error: msg, invalid_type_error: msg }));

export const preprocessDateOptional = (msg = "Invalid date") =>
  z.preprocess((val) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date().optional());

// -------- Any / File --------
export const preprocessAny = (shape) =>
  z
    .union([
      z.string().url("Must be a valid URL"),
      z.string(),
      z.object(shape || {}).passthrough(),
    ])
    .nullable()
    .optional();

export const preprocessFileFlexible = (msg = "Invalid input") =>
  z
    .any()
    .optional()
    .refine(
      (val) =>
        val === undefined || typeof val === "string" || val instanceof File,
      { message: msg }
    );

// -------- Formatter --------
export const formatData = (items, dateFields = [], datetimeFields = []) => {
  const formatDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime())
      ? null
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatDateTime = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const getNested = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

  const setNested = (obj, path, value) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
    target[lastKey] = value;
  };

  return items.map((item) => {
    const result = JSON.parse(JSON.stringify(item));
    dateFields.forEach((field) => {
      const val = getNested(result, field);
      if (val) setNested(result, field, formatDate(val));
    });
    datetimeFields.forEach((field) => {
      const val = getNested(result, field);
      if (val) setNested(result, field, formatDateTime(val));
    });
    return result;
  });
};
