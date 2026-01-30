export function parsePNR(text) {
  // Clean lines
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // -------- Passenger --------
  const passengerLine = lines.find((l) => l.includes("/"));
  const passengerMatch = passengerLine?.match(
    /(\w+)\/(\w+)\s*(MR|MRS|MS)?/
  );

  // -------- Flight --------
  const flightRegex =
    /(?:^\d+\.\s*)?([A-Z]{2})\s*(\d+)\s*([A-Z])\s*(\d{2}[A-Z]{3})\s*([A-Z]{3})([A-Z]{3})\s*HK\d\s*([0-9A-Z]{3,4})(?:\s*([0-9A-Z]{3,4}))?/;
  const flightMatches = lines
    .map((line) => line.match(flightRegex))
    .filter(Boolean);
  const upperText = text.toUpperCase();
  const upperLines = lines.map((line) => line.toUpperCase());
  const locatorLineRegex =
    /(PNR|LOCATOR|RECLOC|RECORD LOCATOR|BOOKING REF|BOOKING REFERENCE|REF|AIRLINE|GDS)\b/;
  const keywordLines = upperLines.filter((line) =>
    locatorLineRegex.test(line)
  );
  const keywordLocatorRegex = /\b[A-Z0-9]{5,8}\b/g;
  const fallbackLocatorRegex = /\b[A-Z0-9]{6,8}\b/g;
  const passengerTokens = [
    passengerMatch?.[1],
    passengerMatch?.[2],
  ].filter(Boolean);
  const bannedTokens = new Set(passengerTokens.map((token) => token.toUpperCase()));
  const locatorCandidates = keywordLines.length
    ? keywordLines.flatMap((line) => line.match(keywordLocatorRegex) || [])
    : upperLines.flatMap((line) =>
        flightRegex.test(line) || line === passengerLine?.toUpperCase()
          ? []
          : line.match(fallbackLocatorRegex) || []
      );
  const locators = [
    ...new Set(locatorCandidates.filter((code) => !bannedTokens.has(code))),
  ];
  const explicitAirlineMatch = upperText.match(
    /AIRLINE\s*(?:PNR|LOCATOR|CODE)?\s*[:\-]?\s*([A-Z0-9]{5,8})/
  );
  const explicitGdsMatch = upperText.match(
    /GDS\s*(?:PNR|LOCATOR|CODE)?\s*[:\-]?\s*([A-Z0-9]{5,8})/
  );
  const airlinePnrMatch = upperText.match(/\bPNR\s+([A-Z0-9]{5,6})\b/);
  const gdsPnrMatch = upperText.match(/RP\/[A-Z]{3}[A-Z0-9]+\/([A-Z0-9]+)/);
  let airlinePnr =
    explicitAirlineMatch?.[1] || airlinePnrMatch?.[1] || "";
  let gdsPnr = explicitGdsMatch?.[1] || gdsPnrMatch?.[1] || "";
  if (!airlinePnr && !gdsPnr) {
    airlinePnr = locators[0] || "";
    gdsPnr = locators[1] || "";
  } else if (airlinePnr && !gdsPnr) {
    gdsPnr = locators.find((code) => code !== airlinePnr) || "";
  } else if (!airlinePnr && gdsPnr) {
    airlinePnr = locators.find((code) => code !== gdsPnr) || "";
  }

  if (!passengerMatch || flightMatches.length === 0) {
    return null;
  }

  const normalizeTime = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 3) return `0${digits}`;
    return digits;
  };
  const flightSegments = flightMatches.map((match) => ({
    airline: match[1], // BG
    flightNo: match[2], // 022
    bookingClass: match[3], // Y
    date: match[4], // 15OCT
    from: match[5], // DAC
    to: match[6], // DXB
    depTime: normalizeTime(match[7]), // 1830
    arrTime: normalizeTime(match[8]), // 2145
  }));

  return {
    pnr: {
      airline: airlinePnr,
      gds: gdsPnr,
    },
    passenger: {
      lastName: passengerMatch[1],
      firstName: passengerMatch[2],
      title: passengerMatch[3] || "",
    },

    flight: flightSegments[0],
    flights: flightSegments,
  };
}
