import { apiBaseUrl } from "./api-config.js";

export async function saveHumanFile(user) {
  if (!apiBaseUrl) throw new Error("Cloud Run API is not configured");
  const token = await user.getIdToken();
  const response = await fetch(`${apiBaseUrl}/api/human`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Could not save human.md");
  const { content } = await response.json();
  return new Blob([content], { type: "text/markdown" });
}
