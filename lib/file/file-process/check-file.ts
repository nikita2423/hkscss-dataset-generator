// import { FILE } from "@/constant";

export const FILE = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB in bytes
};

export const TASK = {
  STATUS: {
    PROCESSING: 0,
    COMPLETED: 1,
    FAILED: 2,
  },
};

/**
 * 检查文件大小
 */
export function checkMaxSize(files: any) {
  const oversizedFiles = files.filter(
    (file: any) => file.size > FILE.MAX_FILE_SIZE
  );
  if (oversizedFiles.length > 0) {
    throw new Error(
      `Max 50MB: ${oversizedFiles.map((f: any) => f.name).join(", ")}`
    );
  }
}

/**
 * 获取可以上传的文件
 * @param {*} files
 * @returns
 */
export function getvalidFiles(files: any) {
  return files.filter(
    (file: any) =>
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".epub")
  );
}

/**
 * 检查不能上传的文件
 * @param {*} files
 * @returns
 */
export function checkInvalidFiles(files: any) {
  const invalidFiles = files.filter(
    (file: any) =>
      !file.name.endsWith(".md") &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".docx") &&
      !file.name.endsWith(".pdf") &&
      !file.name.endsWith(".epub")
  );
  if (invalidFiles.length > 0) {
    throw new Error(
      `Unsupported File Format: ${invalidFiles
        .map((f: any) => f.name)
        .join(", ")}`
    );
  }
  return invalidFiles;
}
