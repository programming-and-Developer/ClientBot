// 📄 File: ChangeModel.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../utils/api";

export default function ChangeModel() {
  const { pages, selectedPage } = useAuth();
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPage) {
      const currentPage = pages.find(p => p.pageId === selectedPage);
      setModel(currentPage?.botSettings?.selectedModel || "");
      setMessage("");
    }
  }, [selectedPage, pages]);

  const handleModelChange = async (e) => {
    const newModel = e.target.value;
    setModel(newModel);
    setMessage("⏳ جاري تحديث الموديل...");

    try {
      await axios.post(
        `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
        { selectedModel: newModel },
        { withCredentials: true }
      );

      const updatedPages = pages.map(p =>
        p.pageId === selectedPage
          ? { ...p, botSettings: { ...p.botSettings, selectedModel: newModel } }
          : p
      );

      localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
      setMessage("✅ تم تحديث الموديل بنجاح!");
    } catch (error) {
      console.error("❌ فشل في تحديث الموديل:", error);
      setMessage("❌ حدث خطأ أثناء تحديث الموديل.");
    }
  };

  return (
    <div className="container">
      <div className="form-group mt-3">
        <label className="fw-bold mb-2">🔍 اختر الموديل</label>
        <select
          className="form-control"
          value={model}
          onChange={handleModelChange}
          required
        >
          <option value="">اختر الموديل</option>
          {/* <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
          <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8b</option>
          <option value="gemini-2.0-flash-lite-001">Gemini 2.0 Flash-lite</option> */}
          <option value="gemini-2.0-flash-001">Gemini 2.0 Flash</option>
        </select>
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
