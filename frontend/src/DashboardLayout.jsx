import { useEffect, useRef, useState } from "react";
import SidebarMenu from "./components/SidebarMenu";
import "./sidebar.css";

function DashboardLayout({ title, children }) {
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setSidebarVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="layout-container">
      <div className={`layout-sidebar-wrapper ${sidebarVisible ? "visible" : "hidden"}`}>
        <SidebarMenu user={user} />
      </div>

      <main className={`layout-main ${sidebarVisible ? "" : "layout-main-expanded"}`}>
        <div className="layout-content">
          <h1 className="layout-title">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;