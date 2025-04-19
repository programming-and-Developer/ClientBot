import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../utils/api";
export default function Start_Stop_Bot() {
  const { user, pages, selectedPage } = useAuth();
  const [botStatus, setBotStatus] = useState("⛔ The bot is stopped");
  const [botActive, setBotActive] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPage) {
      const currentPage = pages.find(p => p.pageId === selectedPage);
      if (currentPage) {
        setBotActive(currentPage.botSettings.botActive);
        setBotStatus(currentPage.botSettings.botActive ? "✅ The bot is activated" : "⛔ The bot is stopped");
        setMessage(""); // تنظيف الرسالة عند تغيير الصفحة
      }
    }
  }, [selectedPage, pages]);

  const handleStartBot = async () => {
    setBotActive(true);
    setBotStatus("✅ The bot is activated");
    try {
      await axios.post(
        `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
        { botActive: true },
        { withCredentials: true }
      );
      const updatedPages = pages.map(p =>
        p.pageId === selectedPage ? { ...p, botSettings: { ...p.botSettings, botActive: true } } : p
      );
      localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
      setMessage("✅ تم تشغيل البوت بنجاح!");
    } catch (error) {
      console.error("❌ فشل في تشغيل البوت:", error);
      setMessage("❌ حدث خطأ أثناء تشغيل البوت.");
      setBotActive(false);
      setBotStatus("⛔ The bot is stopped");
    }
  };

  const handleStopBot = async () => {
    setBotActive(false);
    setBotStatus("⛔ The bot is stopped");
    try {
      await axios.post(
        `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
        { botActive: false },
        { withCredentials: true }
      );
      const updatedPages = pages.map(p =>
        p.pageId === selectedPage ? { ...p, botSettings: { ...p.botSettings, botActive: false } } : p
      );
      localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
      setMessage("✅ تم إيقاف البوت بنجاح!");
    } catch (error) {
      console.error("❌ فشل في إيقاف البوت:", error);
      setMessage("❌ حدث خطأ أثناء إيقاف البوت.");
      setBotActive(true);
      setBotStatus("✅ The bot is activated");
    }
  };

  return (
    <>
      <h2 className="text-center mb-4 mt-5">Welcome To Bot Control</h2>
      <div className="text-center mb-3">
        <h5>{botStatus}</h5>
      </div>
      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-success" onClick={handleStartBot} disabled={botActive}>
          ▶️ Run the bot
        </button>
        <button className="btn btn-danger" onClick={handleStopBot} disabled={!botActive}>
          ⏹️ Stop the bot
        </button>
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </>
  );
}