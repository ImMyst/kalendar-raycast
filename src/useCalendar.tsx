import { showToast, Toast } from "@raycast/api";
import osascript from "osascript-tag";

export const executeJxa = async (script: string) => {
  try {
    const result = await osascript.jxa({ parse: true })`${script}`;
    return result;
  } catch (err: unknown) {
    if (typeof err === "string") {
      const message = err.replace("execution error: Error: ", "");
      console.log(err);
      showToast(Toast.Style.Failure, "Something went wrong", message);
    }
  }
};
