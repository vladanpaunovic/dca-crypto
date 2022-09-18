import fp from "fingerprintjs2";

export const cleanData = (f) => {
  for (let key in f) {
    if (f[key] === null || f[key] === undefined || f[key] instanceof Error) {
      delete f[key];
    }
    if (Array.isArray(f[key])) {
      f[key] = f[key].join(", ");
    }
    if (
      (typeof f[key] === "string" || f[key] instanceof String) &&
      f[key].length === 0
    ) {
      delete f[key];
    }
    if (typeof f[key] === "boolean") {
      f[key] = `${f[key]}`;
    }
  }

  return f;
};

export const getFingerprint = () =>
  fp.get(null, function (components) {
    const values = components.map(function (component) {
      return component.value;
    });
    const murmur = fp.x64hash128(values.join(""), 31);
    return murmur;
  });
