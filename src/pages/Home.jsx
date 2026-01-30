import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import PnrInput from "../components/pnr/PnrInput";
import ParseButton from "../components/pnr/ParseButton";
import TicketPreview from "../components/ticket/TicketPreview";
import { parsePNR } from "../services/pnrParser";
import brandLogo from "../assets/brand-logo.svg";

export default function Home({ isAdminOverride = null }) {
  const settingsStorageKey = "flyitgo:adminSettings";
  const accessStorageKey = "flyitgo:agentAccess";
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const codeParam = searchParams?.get("code") || "";
  const isAdmin = isAdminOverride ?? (searchParams?.get("admin") === "1");
  const getDefaultSettings = () => ({
    brandName: "Golden Horizon Travel",
    brandLogoSrc: brandLogo,
    isUpgraded: false,
    agentContact: "",
  });
  const loadAccessList = () => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(accessStorageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const saveAccessList = (nextList) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(accessStorageKey, JSON.stringify(nextList));
  };
  const loadAdminSettings = () => {
    if (typeof window === "undefined") return getDefaultSettings();
    const raw = window.localStorage.getItem(settingsStorageKey);
    if (!raw) return getDefaultSettings();
    try {
      const parsed = JSON.parse(raw);
      return {
        brandName: parsed.brandName || getDefaultSettings().brandName,
        brandLogoSrc: parsed.brandLogoSrc || getDefaultSettings().brandLogoSrc,
        isUpgraded: Boolean(parsed.isUpgraded),
        agentContact: parsed.agentContact || "",
      };
    } catch {
      return getDefaultSettings();
    }
  };
  const settingsFromCode = () => {
    if (!codeParam) return null;
    const list = loadAccessList();
    const record = list.find((item) => item.code === codeParam);
    if (!record) return null;
    return {
      brandName: record.brandName || getDefaultSettings().brandName,
      brandLogoSrc: record.brandLogoSrc || getDefaultSettings().brandLogoSrc,
      isUpgraded: Boolean(record.isUpgraded),
      agentContact: record.agentContact || "",
    };
  };
  const initialSettings =
    settingsFromCode() || (isAdmin ? loadAdminSettings() : getDefaultSettings());
  const [pnrText, setPnrText] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [parseError, setParseError] = useState("");
  const [brandName, setBrandName] = useState(initialSettings.brandName);
  const [brandLogoSrc, setBrandLogoSrc] = useState(
    initialSettings.brandLogoSrc
  );
  const [isUpgraded, setIsUpgraded] = useState(initialSettings.isUpgraded);
  const [agentContact, setAgentContact] = useState(
    initialSettings.agentContact
  );
  const [accessList, setAccessList] = useState(loadAccessList());
  const [currentAccessCode, setCurrentAccessCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const brandTagline = "Premium PNR Ticketing";
  const buildOrderId = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `FG-${y}${m}${d}-${rand}`;
  };
  const buildAccessCode = (name) => {
    const slug = String(name || "AGENT")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 24);
    return slug || "agent";
  };
  const upgradeMessage = `Upgrade request: ${brandName}${
    agentContact ? ` (${agentContact})` : ""
  }. Order ID: ${orderId || "NEW"}.`;
  const upgradeUrl = `https://wa.me/?text=${encodeURIComponent(
    upgradeMessage
  )}`;

  const handleInputChange = (nextValue) => {
    setPnrText(nextValue);
    if (parseError) {
      setParseError("");
    }
  };

  const handleParse = () => {
    const trimmed = pnrText.trim();
    if (!trimmed) {
      setTicketData(null);
      setParseError("Paste your PNR text first.");
      return;
    }

    const result = parsePNR(trimmed);
    if (!result) {
      setTicketData(null);
      setParseError("Unable to parse the PNR. Please check the format.");
      return;
    }
    setParseError("");
    setTicketData(result);
    setOrderId(buildOrderId());
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBrandLogoSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAccessLink = () => {
    const nextCode = buildAccessCode(brandName);
    const record = {
      code: nextCode,
      brandName,
      brandLogoSrc,
      isUpgraded,
      agentContact,
      updatedAt: new Date().toISOString(),
    };
    const nextList = [
      record,
      ...accessList.filter(
        (item) =>
          item.code !== nextCode &&
          item.agentContact !== agentContact &&
          item.brandName !== brandName
      ),
    ];
    setAccessList(nextList);
    setCurrentAccessCode(nextCode);
    saveAccessList(nextList);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !isAdmin) return;
    const payload = {
      brandName,
      brandLogoSrc,
      isUpgraded,
      agentContact,
    };
    window.localStorage.setItem(settingsStorageKey, JSON.stringify(payload));
  }, [brandName, brandLogoSrc, isUpgraded, agentContact, isAdmin]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!codeParam) return;
    const list = loadAccessList();
    const record = list.find((item) => item.code === codeParam);
    if (!record) return;
    setBrandName(record.brandName || getDefaultSettings().brandName);
    setBrandLogoSrc(record.brandLogoSrc || getDefaultSettings().brandLogoSrc);
    setIsUpgraded(Boolean(record.isUpgraded));
    setAgentContact(record.agentContact || "");
    setCurrentAccessCode(codeParam);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Box
              component="img"
              src={brandLogoSrc}
              alt={`${brandName} logo`}
              sx={{ width: 64, height: 64 }}
            />
            <Typography variant="h4">{brandName}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {brandTagline}
            </Typography>
          </Stack>

          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(212, 175, 55, 0.2)",
              background: "rgba(17, 24, 39, 0.65)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1">Branding</Typography>
              <TextField
                label="Company name"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                fullWidth
              />
              {isAdmin && (
                <TextField
                  label="Agent name / phone (for tracking)"
                  value={agentContact}
                  onChange={(event) => setAgentContact(event.target.value)}
                  fullWidth
                />
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ alignSelf: "flex-start" }}
                >
                  Upload logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
                <Box
                  component="img"
                  src={brandLogoSrc}
                  alt="Selected logo preview"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                  }}
                />
              </Stack>
            </Stack>
          </Card>

          {isAdmin && (
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(234, 179, 8, 0.35)",
                background: "rgba(30, 41, 59, 0.7)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1">
                  Admin Panel (Internal Use Only)
                </Typography>
                <Divider sx={{ borderColor: "rgba(212, 175, 55, 0.25)" }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isUpgraded}
                      onChange={(event) => setIsUpgraded(event.target.checked)}
                      color="warning"
                    />
                  }
                  label="Admin: Upgrade enabled"
                />
                {agentContact && (
                  <Chip
                    label={`Enabled for: ${agentContact}`}
                    variant="outlined"
                    color="warning"
                    sx={{ alignSelf: "flex-start" }}
                  />
                )}
                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleSaveAccessLink}
                    disabled={!brandName.trim()}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Generate Pro Access Link
                  </Button>
                  {currentAccessCode && (
                    <TextField
                      label="Pro access link"
                      value={`${window.location.origin}/app?code=${currentAccessCode}`}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  )}
                  {accessList.length > 0 && (
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Saved agents:
                      </Typography>
                      {accessList.slice(0, 5).map((item) => (
                        <Typography key={item.code} variant="caption">
                          {item.brandName}{" "}
                          {item.agentContact ? `(${item.agentContact})` : ""} -{" "}
                          /app?code={item.code}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Card>
          )}

          <PnrInput
            value={pnrText}
            onChange={handleInputChange}
            error={Boolean(parseError)}
            helperText={parseError || "Paste your GDS PNR to generate a ticket."}
          />
          <ParseButton onParse={handleParse} disabled={!pnrText.trim()} />
          {ticketData && (
            <TicketPreview
              data={ticketData}
              brandName={brandName}
              brandLogo={brandLogoSrc}
              upgradeUrl={upgradeUrl}
              isUpgraded={isUpgraded}
              orderId={orderId}
            />
          )}
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(212, 175, 55, 0.2)",
              background: "rgba(17, 24, 39, 0.65)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1">প্রাইসিং</Typography>
              <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                ফ্রি প্ল্যানে দিনে ৫টি PDF টিকিট ডাউনলোড করতে পারবেন।
                আনলিমিটেড প্ল্যানে যত খুশি PDF জেনারেট করুন।
              </Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ color: "#fbbf24" }}>
                  ফ্রি: ৫ PDF/দিন
                </Typography>
                <Typography variant="body2" sx={{ color: "#e5e7eb" }}>
                  আনলিমিটেড: মাসিক সাবস্ক্রিপশন (দ্রুত সেটআপ, ব্র্যান্ডেড PDF)
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                  দাম জানতে WhatsApp এ মেসেজ করুন।
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
