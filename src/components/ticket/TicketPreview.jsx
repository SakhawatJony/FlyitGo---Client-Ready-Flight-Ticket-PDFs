import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ConfirmationNumber,
  FlightLand,
  FlightTakeoff,
  Person,
  Schedule,
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { formatTime } from "../../utils/formatTime";
import {
  getPdfLimit,
  getPdfRemaining,
  incrementPdfUsage,
} from "../../utils/pdfUsage";

export default function TicketPreview({
  data,
  brandName,
  brandLogo,
  upgradeUrl = "https://wa.me/?text=I%20want%20to%20upgrade%20FlyitGo%20for%20unlimited%20PDFs.",
  isUpgraded = false,
  orderId = "",
}) {
  const { passenger, flight, flights = [], pnr } = data;
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [remaining, setRemaining] = useState(getPdfRemaining());
  const [gateMessage, setGateMessage] = useState("");
  const freeLimitReached = !isUpgraded && remaining <= 0;
  const showUpgradeCta = freeLimitReached;

  const fileName = useMemo(() => {
    const primaryFlight = flights[0] || flight;
    const flightTag = `${primaryFlight.airline || "flight"}${
      primaryFlight.flightNo || ""
    }`;
    const dateTag = primaryFlight.date || "itinerary";
    return `ticket-${flightTag}-${dateTag}.pdf`.toLowerCase();
  }, [flight, flights]);

  useEffect(() => {
    setRemaining(getPdfRemaining());
  }, []);

  const handleDownload = async () => {
    if (!ticketRef.current || isDownloading) return;
    if (freeLimitReached) {
      setGateMessage("Free limit reached. Upgrade to PRO for unlimited PDFs.");
      return;
    }
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const horizontalPadding = 36;
      const verticalPadding = 36;
      const maxWidth = pageWidth - horizontalPadding * 2;
      const scaledHeight = (canvas.height * maxWidth) / canvas.width;
      const maxHeight = pageHeight - verticalPadding * 2;
      const targetHeight =
        scaledHeight > maxHeight ? maxHeight : scaledHeight;
      const targetWidth =
        scaledHeight > maxHeight
          ? (canvas.width * maxHeight) / canvas.height
          : maxWidth;

      pdf.addImage(
        imgData,
        "PNG",
        horizontalPadding,
        verticalPadding,
        targetWidth,
        targetHeight
      );
      pdf.save(fileName);
      if (!isUpgraded) {
        incrementPdfUsage();
        setRemaining(getPdfRemaining());
      }
      setGateMessage("");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Button
        variant="outlined"
        onClick={handleDownload}
        disabled={isDownloading || (!isUpgraded && remaining <= 0)}
      >
        {isDownloading ? "Preparing PDF..." : "Download PDF"}
      </Button>
      <Typography variant="caption" sx={{ color: "#6b7280" }}>
        {isUpgraded
          ? "Plan: PRO — Unlimited PDFs"
          : freeLimitReached
            ? "Free limit reached today. Upgrade for unlimited PDFs."
            : `Free PDFs left today: ${remaining}/${getPdfLimit()}`}
      </Typography>
      {gateMessage && (
        <Typography variant="caption" color="error">
          {gateMessage}
        </Typography>
      )}
      {showUpgradeCta && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" sx={{ color: "#374151" }}>
            Upgrade for unlimited PDF downloads.
          </Typography>
          <Button
            variant="contained"
            color="warning"
            component="a"
            href={upgradeUrl}
            target="_blank"
            rel="noreferrer"
            sx={{
              textTransform: "none",
              boxShadow: "0 0 12px rgba(234, 179, 8, 0.45)",
            }}
          >
            Upgrade Now
          </Button>
          {orderId && (
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Order ID: {orderId}
            </Typography>
          )}
        </Stack>
      )}

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(212, 175, 55, 0.25)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,240,230,0.9))",
          color: "#111827",
        }}
      >
        <Stack spacing={2} ref={ticketRef}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                component="img"
                src={brandLogo}
                alt={`${brandName} logo`}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6b7280" }}>
                  {brandName}
                </Typography>
                <Typography variant="h6">
                  {flight.from} → {flight.to}
                </Typography>
              </Box>
            </Stack>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 99,
                border: "1px solid rgba(17,24,39,0.12)",
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <Typography variant="caption" sx={{ letterSpacing: "0.18em" }}>
                PREMIUM ITINERARY
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Person fontSize="small" sx={{ color: "#b88a2b" }} />
                  <Typography variant="subtitle2">Passenger</Typography>
                </Stack>
                <Typography>
                  {passenger.lastName}/{passenger.firstName} {passenger.title}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ConfirmationNumber
                    fontSize="small"
                    sx={{ color: "#b88a2b" }}
                  />
                  <Typography variant="subtitle2">PNR Codes</Typography>
                </Stack>
                {pnr?.airline || pnr?.gds ? (
                  <Typography>
                    {pnr?.airline && !pnr?.gds
                      ? `PNR: ${pnr.airline}`
                      : `Airline: ${pnr?.airline || "-"} • GDS: ${
                          pnr?.gds || "-"
                        }`}
                  </Typography>
                ) : (
                  <Typography sx={{ color: "#6b7280" }}>
                    PNR not provided in GDS text
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FlightTakeoff fontSize="small" sx={{ color: "#b88a2b" }} />
              <Typography variant="subtitle2">Flight Segments</Typography>
            </Stack>
            <Stack spacing={2}>
              {(flights.length ? flights : [flight]).map((segment, index) => (
                <Card
                  key={`${segment.airline}-${segment.flightNo}-${index}`}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: "rgba(184,138,43,0.35)",
                    backgroundColor: "rgba(255,248,235,0.9)",
                    color: "#111827",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1">
                        {segment.from} → {segment.to}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        {segment.airline} {segment.flightNo} •{" "}
                        {segment.bookingClass}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule fontSize="small" sx={{ color: "#6b7280" }} />
                        <Typography variant="body2">
                          {segment.date}
                        </Typography>
                      </Stack>
                      <Typography variant="body2">
                        {formatTime(segment.depTime)} -{" "}
                        {formatTime(segment.arrTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FlightLand fontSize="small" sx={{ color: "#6b7280" }} />
                        <Typography variant="body2">
                          Arrival {formatTime(segment.arrTime)}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: "#6b7280" }}>
                        Depart {formatTime(segment.depTime)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>
              Note: PNR codes are shown only if included in the GDS text. This
              PDF is a travel itinerary, not an airline e-ticket.
            </Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              Generated via FlyitGo • Professional itinerary summary
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
