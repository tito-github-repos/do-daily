"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const links = [
  { label: "Home", href: "/", id: "home" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

const REGISTER_HREF = "/#register";

const registerButtonSx = {
  bgcolor: "var(--primary)",
  color: "var(--white)",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  boxShadow: "0 4px 12px #16a34a59",
  "&:hover": {
    bgcolor: "var(--primary)",
    filter: "brightness(0.92)",
    boxShadow: "0 6px 16px #16a34a73",
  },
} as const;

type LogoProps = { onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void };

function Logo({ onClick }: LogoProps) {
  return (
    <Stack
      component={Link}
      href="/"
      onClick={onClick}
      direction="row"
      spacing={{ xs: 1, md: 1.5 }}
      sx={{ alignItems: "center", flexShrink: 0, textDecoration: "none" }}
    >
      <Box
        component="img"
        src="/innovative-brain-icon.svg"
        alt="Do Daily brain logo"
        sx={{
          width: { xs: 28, sm: 32, md: 40 },
          height: { xs: 28, sm: 32, md: 40 },
          objectFit: "contain",
          display: "block",
          filter:
            "brightness(0) saturate(100%) invert(48%) sepia(83%) saturate(424%) hue-rotate(85deg) brightness(92%) contrast(91%)",
        }}
      />
      <Typography
        variant="h5"
        component="span"
        sx={{
          fontWeight: 700,
          whiteSpace: "nowrap",
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.9rem" },
        }}
      >
        <Box component="span" sx={{ color: "var(--black)" }}>
          Do
        </Box>{" "}
        <Box component="span" sx={{ color: "var(--primary)" }}>
          Daily
        </Box>
      </Typography>
    </Stack>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeId, setActiveId] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // switch the active menu while scrolling (home page only)
  useEffect(() => {
    if (pathname !== "/") return;

    const onScroll = () => {
      const contact = document.getElementById("contact");
      if (!contact) return;

      const reachedContact =
        contact.getBoundingClientRect().top <= window.innerHeight * 0.5;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      setActiveId(reachedContact || atBottom ? "contact" : "home");
    };

    onScroll(); // set the correct state on load
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // close the drawer if the window grows to desktop size (md = 900px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Drawer navigation: close first, then scroll (the open drawer locks page scrolling)
  const goTo = (id: string) => {
    setDrawerOpen(false);

    if (pathname !== "/") {
      router.push(id === "home" ? "/" : `/#${id}`);
      return;
    }

    window.setTimeout(() => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "var(--white)",
          color: "var(--black)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              gap: 1,
              minHeight: { xs: 64, md: 80 },
            }}
          >
            <Logo />

            {/* Desktop menu */}
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {links.map(({ label, href, id }) => {
                const isActive = pathname === "/" && activeId === id;
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
                      minWidth: 0,
                      fontSize: "1.1rem",
                      borderRadius: 0,
                      px: 1.5,
                      color: isActive ? "var(--primary)" : "#1f3d2b",
                      borderBottom: "3px solid",
                      borderColor: isActive ? "var(--primary)" : "transparent",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "var(--primary)",
                      },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}

              <Button
                component={Link}
                href={REGISTER_HREF}
                variant="contained"
                sx={{ ...registerButtonSx, px: 3, py: 1, fontSize: "1.05rem" }}
              >
                Register
              </Button>
            </Stack>

            {/* Mobile hamburger */}
            <IconButton
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" }, color: "#1f3d2b" }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile side drawer */}
      <Drawer
        id="mobile-menu"
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: { sx: { width: "min(82vw, 320px)", bgcolor: "var(--white)" } },
        }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              minHeight: 64,
            }}
          >
            <Logo
              onClick={(e) => {
                e.preventDefault();
                goTo("home");
              }}
            />
            <IconButton
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              sx={{ color: "#1f3d2b" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Stack component="nav" sx={{ p: 2, gap: 0.5 }}>
            {links.map(({ label, id }) => {
              const isActive = pathname === "/" && activeId === id;
              return (
                <Button
                  key={id}
                  onClick={() => goTo(id)}
                  aria-current={isActive ? "page" : undefined}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "1.1rem",
                    py: 1.25,
                    px: 2,
                    borderRadius: 2,
                    color: isActive ? "var(--primary)" : "#1f3d2b",
                    bgcolor: isActive ? "var(--primary-light)" : "transparent",
                    "&:hover": {
                      bgcolor: "var(--primary-light)",
                      color: "var(--primary)",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>

          <Box sx={{ p: 2, mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<HowToRegIcon />}
              onClick={() => goTo("register")}
              sx={{ ...registerButtonSx, py: 1.4, fontSize: "1.05rem" }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Spacer: a fixed navbar leaves the page flow, so this keeps the hero from sliding under it */}
      <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 } }} />
    </>
  );
}