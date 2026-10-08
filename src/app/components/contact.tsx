"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const contacts = [
  {
    label: "Mobile",
    icon: <PhoneIcon />,
    href: "tel:+919499953256",
    lines: ["+91 9499953256"],
  },
  {
    label: "Email",
    icon: <EmailIcon />,
    href: "mailto:dodaily@gmail.com",
    lines: ["dodaily@gmail.com"],
  },
  {
    label: "Location",
    icon: <LocationOnIcon />,
    lines: ["B4, Lumiers Enclave,", "#5/1092, Giri Nagar Main Road,", "Ramapuram, Chennai - 600089"],
  },
];

export default function Contact() {
  return (
    <Box component="section" id="contact" sx={{ py: { xs: 4, md: 6 },scrollMarginTop: { xs: 64, md: 80 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{alignItems:"flex-start"}}>
          {/* Left: heading */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1 }}
            >
              Contact Us
            </Typography>
            <Typography sx={{ color: "#3f5a4a", fontSize: { xs: "1rem", md: "1.1rem" } }}>
              We’d love to hear from you. Get in touch with us.
            </Typography>
          </Grid>

          {/* Right: contact details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container rowSpacing={3}>
              {contacts.map(({ label, icon, href, lines }, i) => (
                <Grid
                  key={label}
                  size={{ xs: 12, sm: 4 }}
                  sx={{
                    px: { sm: 3 },
                    borderLeft: { xs: "none", sm: i === 0 ? "none" : "1px solid #16a34a33" },
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                   <Box
  sx={{
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "var(--primary)",
    color: "var(--white)",
    lineHeight: 0,
    "& svg": { fontSize: 24, display: "block" },
  }}
>
  {icon}
</Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#0f3d24", mb: 0.5 }}>{label}</Typography>
                     {lines.map((line) =>
  href ? (
    <Typography
      key={line}
      component="a"
      href={href}
      sx={{ display: "block", color: "#3f5a4a", lineHeight: 1.6, "&:hover": { color: "var(--primary)" } }}
    >
      {line}
    </Typography>
  ) : (
    <Typography
      key={line}
      sx={{ display: "block", color: "#3f5a4a", lineHeight: 1.6, wordBreak: "break-word" }}
    >
      {line}
    </Typography>
  )
)}
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}