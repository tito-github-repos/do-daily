"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";

const links = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "var(--white)", color: "var(--black)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: { xs: 64, md: 80 } }}>
          {/* Logo */}
          <Stack component={Link} href="/" direction="row"  spacing={1.5}
          sx={{alignItems:"center"}}
          >
            <Box sx={{ position: "relative", width: { xs: 36, md: 48 }, height: { xs: 36, md: 48 } }}>
              <Image src="/b-svg.svg" alt="Do Daily logo" fill priority />
            </Box>
            <Typography
              variant="h5"
              component="span"
              sx={{ fontWeight: 700, color: "var(--primary)", fontSize: { xs: "1.4rem", md: "1.9rem" } }}
            >
              Do Daily
            </Typography>
          </Stack>

          {/* Menu */}
          <Stack direction="row" spacing={{ xs: 0.5, md: 3 }}>
            {links.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  disableRipple
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    borderRadius: 0,
                    px: { xs: 1, md: 1.5 },
                    color: isActive ? "var(--primary)" : "#1f3d2b",
                    borderBottom: "3px solid",
                    borderColor: isActive ? "var(--primary)" : "transparent",
                    "&:hover": { bgcolor: "transparent", color: "var(--primary)" },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}