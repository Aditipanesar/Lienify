import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, theme, toggleTheme } = useStoreContext();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  return (
    <div className="lf-nav h-16 z-50 flex items-center sticky top-0">
      <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">

        {/* ── Logo + tagline ── */}
        <Link to="/" className="flex items-center gap-3">
          <img
            
            src="/images/Lienify_logo.svg"
            alt="Lienify"
          // className="h-11 w-auto object-contain"
            style={{ height: "100px", width: "auto" }}
          />
          {/* <span
            className="hidden md:block"
            style={{
              fontSize: "11px",
              color: "var(--txt-muted)",
              borderLeft: "0.5px solid var(--border-soft)",
              paddingLeft: "12px",
              lineHeight: "1.4",
              maxWidth: "140px",
            }}
          >
            Smart URL shortening
          </span> */}
        </Link>

        {/* ── Desktop links ── */}
        <ul
          className={`
            flex sm:gap-8 gap-4 sm:items-center sm:mt-0 sm:pt-0 pt-4
            sm:static absolute left-0 top-[62px]
            sm:shadow-none shadow-lg
            ${navbarOpen ? "h-fit pb-5 sm:pb-0" : "h-0 overflow-hidden"}
            transition-all duration-150 sm:h-fit
            sm:bg-transparent
            sm:w-fit w-full sm:flex-row flex-col px-6 sm:px-0
          `}
          style={{
            backgroundColor: navbarOpen ? "var(--bg-nav)" : undefined,
            borderBottom: navbarOpen ? "0.5px solid var(--border-soft)" : undefined,
          }}
        >
          {[
            { label: "Home", to: "/" },
            { label: "About", to: "/about" },
            ...(token ? [{ label: "Dashboard", to: "/dashboard" }] : []),
          ].map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={path === to ? "lf-nav-link-active" : "lf-nav-link"}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Mobile-only auth */}
          <li className="sm:hidden mt-2">
            <button onClick={toggleTheme} className="lf-theme-toggle" style={{ marginBottom: "8px" }}>
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </li>
          <li className="sm:hidden">
            {!token ? (
              <Link to="/register">
                <button className="lf-logout-btn">Sign Up</button>
              </Link>
            ) : (
              <button onClick={onLogOutHandler} className="lf-logout-btn">Log Out</button>
            )}
          </li>
        </ul>

        {/* ── Desktop right ── */}
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={toggleTheme} className="lf-theme-toggle">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>

          {!token ? (
            <Link to="/register">
              <button className="lf-logout-btn">Sign Up</button>
            </Link>
          ) : (
            <button onClick={onLogOutHandler} className="lf-logout-btn">Log Out</button>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center"
          style={{ color: "var(--txt-primary)" }}
        >
          {navbarOpen
            ? <RxCross2 style={{ fontSize: "26px" }} />
            : <IoIosMenu style={{ fontSize: "28px" }} />}
        </button>

      </div>
    </div>
  );
};

export default Navbar;

