"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const DIVIDER = "1px solid #16a34a33";

type Item = { icon: React.ReactNode; href?: string; lines: string[] };

const columns: Item[][] = [
  [
    { icon: <PhoneIcon />, href: "tel:+919499953257", lines: ["+91 9499953257"] },
    { icon: <EmailIcon />, href: "mailto:dodailyusers@gmail.com", lines: ["dodailyusers@gmail.com"] },
  ],
  [
    {
      icon: <LocationOnIcon />,
      lines: ["B4, Lumiers Enclave,", "#5/1092, Giri Nagar Main Road,", "Ramapuram, Chennai - 600089"],
    },
  ],
];

function Row({ icon, href, lines }: Item) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: { xs: 44, md: 48 },
          height: { xs: 44, md: 48 },
          flexShrink: 0,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "var(--primary-light)",
          color: "#0f6b3a",
          "& svg": { fontSize: { xs: 22, md: 24 } },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {lines.map((line) => (
          <Typography
            key={line}
            component={href ? "a" : "p"}
            {...(href ? { href } : {})}
            sx={{
              display: "block",
              m: 0,
              color: "#3f5a4a",
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1rem" },
              wordBreak: "break-word",
              ...(href && { "&:hover": { color: "var(--primary)" } }),
            }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </Stack>
  );
}

export default function Contact() {
  return (
    <Box component="section" id="contact" sx={{ bgcolor: "var(--primary-light)", py: { xs: 4, md: 6 }, scrollMarginTop: { xs: 64, md: 80 } }}>
      <Container maxWidth="lg">
        <Grid container rowSpacing={{ xs: 3, md: 4 }} sx={{ alignItems: "center", pt: { xs: 2, md: 5 } }}>
          {/* Heading */}
          <Grid size={{ xs: 12, lg: 4 }} sx={{ pr: { lg: 4 } }}>
            <Box sx={{ width: 56, height: 3, bgcolor: "var(--primary)", borderRadius: 2, mb: 1.5 }} />
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.8rem", md: "2.3rem" }, mb: 1 }}
            >
              Contact Us
            </Typography>
            <Typography sx={{ color: "#3f5a4a", fontSize: { xs: "1rem", md: "1.05rem" }, maxWidth: 300 }}>
              We’d love to hear from you. Get in touch with us.
            </Typography>
          </Grid>

          {columns.map((items, i) => (
            <Grid
              key={i}
              size={{ xs: 12, md: 6, lg: i === 0 ? 3.5 : 4.5 }}
              sx={{
                pt: { xs: 3, md: 0 },
                pl: { md: i === 0 ? 0 : 4, lg: 4 },
                pr: { md: 4 },
                borderTop: { xs: DIVIDER, md: "none" },
                borderLeft: { xs: "none", md: i === 0 ? "none" : DIVIDER, lg: DIVIDER },
              }}
            >
              <Stack spacing={2}>
                {items.map((it) => (
                  <Row key={it.lines[0]} {...it} />
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}