import fetch from "node-fetch";
const checkImageExists = async (url) => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};
export default checkImageExists;