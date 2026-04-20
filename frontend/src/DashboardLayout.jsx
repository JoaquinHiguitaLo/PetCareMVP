import { useEffect, useState } from "react";
import SidebarMenu from "./components/SidebarMenu";
import BusinessBottomNav from "./components/BusinessBottomNav";
import "./dashboard.css";
import "./sidebar.css";

function DashboardLayout({ title, children }) {
  const storedUser = localStorage.getItem("user");
  const user =
    storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout-container">
      {!isMobile && (
        <div className="layout-sidebar-wrapper visible">
          <SidebarMenu user={user} />
        </div>
      )}

      <main className="layout-main">
        <div className="layout-content">
          <h1 className="layout-title">{title}</h1>
          {children}
        </div>
      </main>

      {isMobile && <BusinessBottomNav />}
    </div>
  );
}

export default DashboardLayout;