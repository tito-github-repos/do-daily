"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

const DIVIDER = "1px solid #16a34a33";

function MaskIcon({ src }: { src: string }) {
  return (
    <Box
      sx={{
        width: { xs: 38, md: 46 },
        height: { xs: 38, md: 46 },
        bgcolor: "currentColor",
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

const groups = [
  {
    label: "All Age Groups",
    text: "From students to professionals, everyone can benefit.",
    icon: <GroupsIcon />,
  },
  {
    label: "All Minds",
    text: "Build focus, memory and mental clarity.",
    icon: <MaskIcon src="/innovative-brain-icon.svg" />,
  },
  {
    label: "One Goal",
    text: "A healthier, stronger, smarter you.",
    icon: <MaskIcon src="/target-icon.svg" />,
  },
];

export default function Pillars() {
  return (
    <Box component="section" sx={{ bgcolor: "var(--primary-light)", py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.5rem", md: "2.1rem" } }}
          >
            For a sharper mind. For a brighter future.
          </Typography>
          <Box
            sx={{
              width: 64,
              height: 3,
              bgcolor: "var(--primary)",
              borderRadius: 2,
              mx: "auto",
              mt: 1.5,
            }}
          />
        </Box>

        <Grid container rowSpacing={4}>
          {groups.map(({ label, text, icon }, i) => (
            <Grid
              key={label}
              size={{ xs: 12, md: 4 }}
              sx={{
                textAlign: "center",
                px: { xs: 0, md: 3, lg: 6 },
                pt: { xs: i === 0 ? 0 : 4, md: 0 },
                borderTop: { xs: i === 0 ? "none" : DIVIDER, md: "none" },
                borderLeft: { xs: "none", md: i === 0 ? "none" : DIVIDER },
              }}
            >
              <Box
                sx={{
                  width: { xs: 72, md: 84 },
                  height: { xs: 72, md: 84 },
                  mx: "auto",
                  mb: 1.5,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#16a34a26",
                  color: "#0f6b3a",
                  "& svg": { fontSize: { xs: 38, md: 46 } },
                }}
              >
                {icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#0f3d24",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  mb: 0.5,
                }}
              >
                {label}
              </Typography>
              <Typography sx={{ color: "#3f5a4a", lineHeight: 1.6, maxWidth: 260, mx: "auto" }}>
                {text}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}