export function extractLead(text) {
  // NAME (first meaningful line)
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const name =
    lines.find(l => /^[A-Za-z]/.test(l)) || "Unknown Business";

  // PHONE (Pakistan + international)
  const phoneMatch = text.match(/(\+?\d[\d\s\-]{9,15})/);
  const phone = phoneMatch ? phoneMatch[0] : "N/A";

  // ADDRESS (remove noise keywords)
  let address = lines
    .filter(l =>
      !l.includes("Overview") &&
      !l.includes("Reviews") &&
      !l.includes("Save") &&
      !l.includes("Directions") &&
      !l.includes("Share") &&
      !l.includes("Open") &&
      !l.includes("Closed")
    )
    .join(" ");

  // trim long junk
  if (address.length > 250) {
    address = address.substring(0, 250);
  }

  return { name, phone, address };
}