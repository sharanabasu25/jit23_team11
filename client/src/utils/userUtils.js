/**
 * Utility functions for user authentication display across Citizen portal components
 */

/**
 * Retrieve the authenticated user object from localStorage
 */
export function getStoredUser() {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Extract clean first name or display name for citizen greetings and profile labels.
 * Strips role suffixes like '(Citizen)' and falls back gracefully to 'Citizen'.
 * Examples:
 *   - 'Suresh Kumar' -> 'Suresh'
 *   - 'Suresh Kumar (Citizen)' -> 'Suresh'
 *   - 'Ravi' -> 'Ravi'
 *   - 'Priya Patil' -> 'Priya'
 *   - null / undefined -> 'Citizen'
 */
export function getCitizenDisplayName(user) {
  if (!user) return "Citizen";
  const rawName = user.fullName || user.name || "";
  if (!rawName || typeof rawName !== "string") return "Citizen";

  // Strip parenthesized or bracketed role annotations e.g. "(Citizen)"
  const cleaned = rawName.replace(/\s*[\(\[][^()\[\]]*[\)\]]/g, "").trim();
  if (!cleaned) return "Citizen";

  // Extract first name
  const firstName = cleaned.split(/\s+/)[0];
  return firstName || "Citizen";
}

/**
 * Extract uppercase initial for avatars (e.g. 'S' for Suresh, 'C' for Citizen)
 */
export function getCitizenInitial(user) {
  const name = getCitizenDisplayName(user);
  return (name.charAt(0) || "C").toUpperCase();
}
