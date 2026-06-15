/**
 * Normalizes email address by converting to lowercase and trimming whitespace
 * @param {string} email - Raw email input
 * @returns {string} Normalized email
 */
function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

/**
 * Checks membership status via LSCS Core API
 * @param {string} email - Email address to validate
 * @returns {Promise<{isMember: boolean, idNumber: string | null}>} Membership status and student ID number
 * @throws {Error} When API call fails, times out, or returns invalid response
 */
export async function checkMembershipByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || typeof normalizedEmail !== "string") {
    throw new Error("Invalid email provided");
  }

  if (!process.env.LSCS_CORE_URL) {
    console.warn("[LSCS Core] Missing LSCS_CORE_URL environment variable");
    throw new Error("LSCS Core API failed to respond. Please try again later.");
  }

  if (!process.env.LSCS_CORE_API_KEY) {
    console.warn("[LSCS Core] Missing LSCS_CORE_API_KEY environment variable");
    throw new Error("LSCS Core API failed to respond. Please try again later.");
  }

  const url = `${process.env.LSCS_CORE_URL}/member`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LSCS_CORE_API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail }),
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return { isMember: false };
    }

    if (!response.ok) {
      const statusText = response.statusText || "Unknown error";
      console.warn(
        `[LSCS Core] API responded with status ${response.status}: ${statusText}`,
      );
      throw new Error(
        "LSCS Core API failed to respond. Please try again later.",
      );
    }

    const data = await response.json();

    if (!data?.id) {
      console.warn("[LSCS Core] Invalid response format (missing id):", data);
      throw new Error(
        "LSCS Core API failed to respond. Please try again later.",
      );
    }

    const duration = Date.now() - startTime;
    if (duration > 500) {
      console.debug(
        `[LSCS Core] Request completed in ${duration}ms`,
      );
    }

    return {
      isMember: true,
      idNumber: String(data.id),
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.warn("[LSCS Core] Request timed out after 5000ms");
    } else {
      console.warn(`[LSCS Core] Request failed: ${error.message}`);
    }

    throw new Error("LSCS Core API failed to respond. Please try again later.");
  }
}
