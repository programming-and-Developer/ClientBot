import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api"; // تأكد من تحديث المسار حسب هيكل مشروعك
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const navigate = useNavigate();

  // دالة لجلب بيانات المستخدم من الـ Backend وتحديث الحالة
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/user-data`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const { user: backendUser } = response.data;
        setUser(backendUser);
        setPages(backendUser.pages);
        setSelectedPage(backendUser.lastSelectedPage || (backendUser.pages.length > 0 ? backendUser.pages[0].pageId : null));
        localStorage.setItem("cachedUser", JSON.stringify(backendUser));
        localStorage.setItem("cachedPages", JSON.stringify(backendUser.pages));
        console.log("✅ Synced with backend:", backendUser, backendUser.pages);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error.message, error.response?.data, error.response?.status);
      if (error.response?.status === 401 || error.response?.status === 500) {
        localStorage.removeItem("cachedUser");
        localStorage.removeItem("cachedPages");
        setUser(null);
        setPages([]);
        setSelectedPage(null);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const cachedUser = localStorage.getItem("cachedUser");
        const cachedPages = localStorage.getItem("cachedPages");

        if (cachedUser && cachedPages) {
          const parsedUser = JSON.parse(cachedUser);
          const parsedPages = JSON.parse(cachedPages);
          setUser(parsedUser);
          setPages(parsedPages);
          setSelectedPage(parsedUser.lastSelectedPage || (parsedPages.length > 0 ? parsedPages[0].pageId : null));
          console.log("✅ Loaded from localStorage:", parsedUser, parsedPages);
          // جلب البيانات من الـ Backend بعد تحميل البيانات من localStorage
          await fetchUserData();
        } else {
          console.log("⚠️ مافيش بيانات مخزنة في localStorage، بنوجه لتسجيل الدخول");
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Error initializing user:", error.message);
        localStorage.removeItem("cachedUser");
        localStorage.removeItem("cachedPages");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, [navigate]);

  // تحديث البيانات عند تغيير الصفحة المختارة
  useEffect(() => {
    if (selectedPage) {
      fetchUserData();
    }
  }, [selectedPage]);

  const login = async (userData) => {
    try {
      setUser(userData);
      setPages(userData.pages);
      setSelectedPage(userData.lastSelectedPage || (userData.pages.length > 0 ? userData.pages[0].pageId : null));
      localStorage.setItem("cachedUser", JSON.stringify(userData));
      localStorage.setItem("cachedPages", JSON.stringify(userData.pages));
      console.log("✅ User logged in:", userData);

      // جلب البيانات من السيرفر بعد تسجيل الدخول
      await fetchUserData();
    } catch (error) {
      console.error("❌ Error syncing after login:", error.message, error.response?.data, error.response?.status);
      if (error.response?.status === 401 || error.response?.status === 500) {
        localStorage.removeItem("cachedUser");
        localStorage.removeItem("cachedPages");
        setUser(null);
        setPages([]);
        setSelectedPage(null);
        navigate("/");
      }
    }
  };

  const logout = () => {
    setUser(null);
    setPages([]);
    setSelectedPage(null);
    localStorage.removeItem("cachedUser");
    localStorage.removeItem("cachedPages");
    axios
      .post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      .catch((error) => console.error("❌ Error during logout:", error));
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, pages, login, logout, loading, selectedPage, setSelectedPage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);