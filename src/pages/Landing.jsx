import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ticketPreviewPdf from "../assets/ticket-preview.pdf";

export default function Landing() {
  const navigate = useNavigate();
  const handleWhatsApp = () => {
    const phone = "8801302086413";
    const message = encodeURIComponent(
      "Hello, I want to upgrade FlyitGo for unlimited PDF ticket downloads."
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };
  const handleTryFree = () => {
    navigate("/app");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1f2937 0%, #020617 70%)",
        color: "#e5e7eb",
        py: 10,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} textAlign="center">
          <Typography variant="h3" fontWeight={700}>
            Create Client-Ready Flight Ticket PDFs in Seconds
          </Typography>

          <Typography color="#9ca3af">
            Stop sending confusing GDS text.
            <br />
            Share clean, branded itineraries your clients instantly understand.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={handleTryFree}>
              Try Free - No Login Required
            </Button>
            <Button variant="outlined" size="large" onClick={handleWhatsApp}>
              Get Unlimited PDFs (WhatsApp)
            </Button>
          </Stack>
          <Typography variant="caption" color="#94a3b8">
            No credit card required - start in seconds
          </Typography>
        </Stack>

        <Box mt={12}>
          <Typography variant="h5" gutterBottom>
            The Problem Travel Agents Face
          </Typography>

          <Stack spacing={1} color="#d1d5db">
            <Typography>- GDS PNR text is confusing for clients</Typography>
            <Typography>- Manual typing wastes 10-15 minutes</Typography>
            <Typography>- Clients keep calling to confirm details</Typography>
            <Typography>- No professional branding in WhatsApp</Typography>
          </Stack>
        </Box>

        <Box mt={9}>
          <Typography variant="h5" gutterBottom>
            FlyitGo Solves This Instantly
          </Typography>

          <Stack spacing={1}>
            <Typography>- Paste GDS PNR</Typography>
            <Typography>- Generate clean ticket PDF</Typography>
            <Typography>- Add your company name & logo</Typography>
            <Typography>- Send via WhatsApp or Email</Typography>
          </Stack>
        </Box>

        <Box mt={9}>
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              background: "rgba(30, 41, 59, 0.45)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              boxShadow: "0 0 24px rgba(15, 23, 42, 0.35)",
            }}
          >
            <Stack spacing={1} textAlign={{ xs: "left", md: "center" }}>
              <Typography variant="h5">Before vs After</Typography>
              <Typography color="#9ca3af">
                Show clients a clear, branded summary instead of raw GDS text.
              </Typography>
            </Stack>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: "100%", background: "#111827" }}>
                  <Stack spacing={1}>
                    <Typography fontWeight={700}>Before</Typography>
                    <Typography color="#9ca3af">
                      Confusing GDS lines and mixed codes.
                    </Typography>
                    <Stack spacing={0.5} color="#d1d5db">
                      <Typography>- Clients ask repeated questions</Typography>
                      <Typography>- Manual clarification takes time</Typography>
                      <Typography>- No branding or professionalism</Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    background: "#0f172a",
                    border: "1px solid rgba(234, 179, 8, 0.25)",
                  }}
                >
                  <Stack spacing={1}>
                    <Typography fontWeight={700}>After</Typography>
                    <Typography color="#9ca3af">
                      Clean, branded PDF itinerary your client understands at a
                      glance.
                    </Typography>
                    <Stack spacing={0.5} color="#d1d5db">
                      <Typography>- Branded header and logo</Typography>
                      <Typography>- Clear routes, times, and fares</Typography>
                      <Typography>- Easy to share on WhatsApp</Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Box>

        <Box mt={7}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Stack spacing={1.5}>
                <Typography variant="h5">Screenshot Preview</Typography>
                <Typography color="#9ca3af">
                  Replace this placeholder with a real PDF screenshot or sample
                  image of your branded ticket.
                </Typography>
                <Typography color="#d1d5db">
                  Clients see the important details at a glance, so fewer follow
                  ups and faster confirmations.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  p: 2,
                  background: "#0b1220",
                  border: "1px dashed rgba(148, 163, 184, 0.35)",
                }}
              >
                <Box
                  component="iframe"
                  title="Ticket preview"
                  src={ticketPreviewPdf}
                  sx={{
                    width: "100%",
                    minHeight: 320,
                    border: "0",
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))",
                  }}
                />
              </Card>
              <Typography variant="caption" color="#94a3b8">
                Real ticket preview generated with FlyitGo (shared daily by
                travel agents via WhatsApp).
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            What Is This PDF?
          </Typography>

          <Typography color="#d1d5db">
            This is a <b>customer-friendly flight itinerary PDF</b> - perfect for
            booking confirmation and client communication.
          </Typography>
          <Typography color="#9ca3af" mt={1}>
            Used by travel agents to confirm bookings and reduce follow-up calls.
          </Typography>
        </Box>

        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Important Note
          </Typography>

          <Typography color="#9ca3af">
            This is NOT a boarding pass or airline e-ticket.
            <br />
            It is a professional summary for clients.
          </Typography>
        </Box>

        <Box mt={7}>
          <Typography variant="h5" gutterBottom>
            How It Works
          </Typography>

          <Grid container spacing={2}>
            {["Paste GDS PNR", "Click Generate Ticket", "Download & Send PDF"].map(
              (step, i) => (
                <Grid item xs={12} md={4} key={step}>
                  <Card
                    sx={{ p: 3, background: "#020617", color: "#e5e7eb" }}
                  >
                    <Typography fontWeight={600}>
                      {i + 1}. {step}
                    </Typography>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        <Box mt={9} textAlign="center">
          <Typography variant="h5" gutterBottom>
            Simple Pricing
          </Typography>

          <Typography>Free: 5 PDFs per day</Typography>
          <Typography>Pro: Unlimited PDFs</Typography>
          <Typography color="#facc15" mt={1}>
            Starting from BDT 500 / month
          </Typography>
          <Typography color="#9ca3af" mt={1}>
            Most agents recover the monthly cost within their first day of use.
          </Typography>
        </Box>

        <Box mt={9} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Start Sending Professional Tickets Today
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" size="large" onClick={handleTryFree}>
              Try Free - No Login Required
            </Button>
            <Button variant="outlined" size="large" onClick={handleWhatsApp}>
              Get Unlimited PDFs (WhatsApp)
            </Button>
          </Stack>
        </Box>

        <Box mt={6} textAlign="center">
          <Typography color="#94a3b8">
            Built specifically for travel agents in Bangladesh 🇧🇩
          </Typography>
          <Typography color="#94a3b8">
            WhatsApp-first • Simple • No training required
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
