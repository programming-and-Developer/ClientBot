// 📄 File: ApiKeyPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../utils/api";

export default function ApiKeyInput() {
  const { pages, selectedPage } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPage) {
      const currentPage = pages.find(p => p.pageId === selectedPage);
      setApiKey(currentPage?.botSettings?.apiKey || "");
      setMessage("");
    }
  }, [selectedPage, pages]);

  const handleBlur = async () => {
    if (!apiKey) {
      setMessage("❌ الرجاء إدخال مفتاح API.");
      return;
    }

    setMessage("⏳ جاري التحقق من المفتاح...");

    try {
      const verifyRes = await axios.post(
        `${API_BASE_URL}/api/pages/verify-api-key`,
        { apiKey, pageId: selectedPage },
        { withCredentials: true }
      );

      if (verifyRes.data.success) {
        await axios.post(
          `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
          { apiKey },
          { withCredentials: true }
        );

        const updatedPages = pages.map(p =>
          p.pageId === selectedPage
            ? { ...p, botSettings: { ...p.botSettings, apiKey } }
            : p
        );
        localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
        setMessage("✅ مفتاح API صالح وتم حفظه!");
      } else {
        setMessage("❌ مفتاح API غير صالح أو غير مفعل!");
      }
    } catch (error) {
      console.error("❌ خطأ أثناء التحقق من المفتاح:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        setMessage("❌ المفتاح غير مفعل لـ Live API. يرجى مراجعة إعدادات Google Cloud.");
      } else {
        setMessage("❌ حدث خطأ أثناء التحقق من المفتاح!");
      }
    }
  };

  return (
    <div className="container mt-3">
      <div className="form-group mt-3">
        <label className="block mb-2 fw-semibold">🔑 Enter API Key</label>
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onBlur={handleBlur}
          className="form-control border-dark"
        />
        <p className={`text-sm ${message.includes("✅") ? "text-success" : "text-danger"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
