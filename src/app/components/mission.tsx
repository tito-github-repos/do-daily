"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DIVIDER = "1px solid #16a34a33";

const Underline = () => (
  <Box sx={{ width: 56, height: 3, bgcolor: "var(--primary)", borderRadius: 2, mt: 2 }} />
);

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: { xs: 72, sm: 80, md: 104 },
        height: { xs: 72, sm: 80, md: 104 },
        flexShrink: 0,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        bgcolor: "var(--primary-light)",
        color: "#0f6b3a",
        "& svg": { fontSize: { xs: 40, md: 56 } },
      }}
    >
      {children}
    </Box>
  );
}

function MaskIcon({ src }: { src: string }) {
  return (
    <Box
      sx={{
        width: { xs: 40, md: 56 },
        height: { xs: 40, md: 56 },
        bgcolor: "currentColor",
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

const heading = {
  fontWeight: 800,
  color: "#0f3d24",
  fontSize: { xs: "1.7rem", md: "2.3rem" },
  mb: 1,
} as const;

export default function VisionMission() {
  return (
    <Box
      component="section"
      id="vision-mission"
      sx={{ py: { xs: 5, md: 8 }, scrollMarginTop: { xs: 64, md: 80 } }}
    >
      <Container maxWidth="lg">
        <Grid container rowSpacing={5}>
          {/* Vision */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ pr: { md: 4, lg: 6 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ alignItems: "flex-start" }}
            >
              <IconCircle>
                <VisibilityIcon />
              </IconCircle>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" sx={heading}>
                  Our Vision
                </Typography>
                <Typography
                  sx={{
                    color: "#3f5a4a",
                    lineHeight: 1.8,
                    fontSize: { xs: "1rem", md: "1.15rem" },
                  }}
                >
                  “Mental fitness for everyone, at all times.”
                </Typography>
                <Underline />
              </Box>
            </Stack>
          </Grid>

          {/* Mission */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              pl: { md: 4, lg: 6 },
              borderTop: { xs: DIVIDER, md: "none" },
              borderLeft: { xs: "none", md: DIVIDER },
              pt: { xs: 4, md: 0 },
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ alignItems: "flex-start" }}
            >
              <IconCircle>
                <MaskIcon src="/target-icon.svg" />
              </IconCircle>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" sx={heading}>
                  Our Mission
                </Typography>
                <Typography
                  sx={{
                    color: "#0f3d24",
                    fontWeight: 700,
                    fontSize: { xs: "1.05rem", md: "1.3rem" },
                    mb: 0.5,
                  }}
                >
                  Brain Bites for Better Brain.
                </Typography>
                <Typography
                  sx={{ color: "#3f5a4a", fontSize: { xs: "0.95rem", md: "1.05rem" } }}
                >
                  Do Daily, Drill Daily, One Day. One Practice.
                </Typography>
                <Underline />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}