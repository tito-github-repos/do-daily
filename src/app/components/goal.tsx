"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

export default function Goal() {
  return (
    <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="xl">
        <Grid
          container
          sx={{
            bgcolor: "var(--primary-light)",
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 4 },
            alignItems: "center",
            rowGap: { xs: 2, md: 0 },
          }}
        >
          {/* Icon + title */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              direction="row"
              spacing={3}
              sx={{
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <TrackChangesIcon
                sx={{ fontSize: { xs: 56, md: 72 }, color: "var(--primary)" }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#0f3d24",
                  fontSize: { xs: "1.5rem", md: "1.9rem" },
                }}
              >
                The Goal
              </Typography>
            </Stack>
          </Grid>

          {/* Text */}
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              textAlign: { xs: "center", md: "left" },
              pt: { xs: 2, md: 0 },
              pl: { md: 5 },
              borderTop: { xs: "1px solid #16a34a40", md: "none" },
              borderLeft: { xs: "none", md: "1px solid #16a34a40" },
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                color: "#0f3d24",
                fontSize: { xs: "1.3rem", md: "1.9rem" },
                mb: 0.5,
              }}
            >
              One Day. One Practice. One Better Brain.
            </Typography>
            <Typography
              sx={{ color: "#3f5a4a", fontSize: { xs: "1rem", md: "1.15rem" } }}
            >
              Complete 60 problems in less than one minute.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
