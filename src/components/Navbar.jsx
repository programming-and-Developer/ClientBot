import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../utils/api";
const Navbar = () => {
  const { user, pages, logout, loading, selectedPage, setSelectedPage } = useAuth();

  useEffect(() => {
    if (user && user.lastSelectedPage && !selectedPage) {
      setSelectedPage(user.lastSelectedPage);
      console.log("Selected Page from User:", user.lastSelectedPage);
    }
  }, [user, selectedPage, setSelectedPage]);

  const handlePageChange = async (event) => {
    const selectedPageId = event.target.value;
    setSelectedPage(selectedPageId);
    if (selectedPageId) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/users/update-last-selected/${user._id}`, 
          { lastSelectedPage: selectedPageId }, 
          { withCredentials: true }
        );
        const updatedUser = { ...user, lastSelectedPage: selectedPageId };
        localStorage.setItem("cachedUser", JSON.stringify(updatedUser));
        console.log("الصفحة المختارة:", selectedPageId);
      } catch (error) {
        console.error("❌ فشل في تحديث الصفحة المختارة:", error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setSelectedPage("");
  };

  if (loading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-text">جاري التحميل...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {pages.length > 0 ? (
          <div className="navbar-nav me-auto">
            <select className="form-select w-auto" value={selectedPage || ""} onChange={handlePageChange}>
              <option value="">اختر صفحة</option>
              {pages.map((page) => (
                <option key={page.pageId} value={page.pageId}>
                  {page.pageName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="navbar-text me-auto">لا توجد صفحات</span>
        )}
        {user && (
          <div className="d-flex align-items-center">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <span className="fw-bold me-3">{user.name}</span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;