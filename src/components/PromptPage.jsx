import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTokens } from "../context/TokenContext";
import API_BASE_URL from "../utils/api";
function PromptPage() {
  const { user, pages, selectedPage } = useAuth();
  const { inputTokens, outputTokens } = useTokens();
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPage) {
      const currentPage = pages.find(p => p.pageId === selectedPage);
      if (currentPage && currentPage.botSettings.prompt) {
        setPrompt(currentPage.botSettings.prompt);
      } else {
        setPrompt("");
      }
      setMessage(""); // تنظيف الرسالة عند تغيير الصفحة
    }
  }, [selectedPage, pages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setMessage("❌ الرجاء إدخال برومبت.");
      return;
    }
    if (!inputTokens || !outputTokens) {
      setMessage("❌ الرجاء إدخال قيم للتوكنز في صفحة التوكنز أولاً.");
      return;
    }
    setMessage("⏳ جاري إرسال البيانات...");
    try {
      await axios.post(
        `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
        {
          prompt,
          inputTokens,
          outputTokens,
        },
        { withCredentials: true }
      );
      const updatedPages = pages.map(p =>
        p.pageId === selectedPage
          ? { ...p, botSettings: { ...p.botSettings, prompt, inputTokens, outputTokens } }
          : p
      );
      localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
      setMessage("✅ تم إرسال البرومبت والتوكنز بنجاح!");
    } catch (error) {
      console.error("❌ خطأ أثناء الإرسال:", error);
      setMessage("❌ حدث خطأ أثناء إرسال البيانات.");
    }
  };

  return (
    <div className="container">
      <div className="form-group mt-3">
        <label className="fw-bold">📝 Enter the prompt</label>
        <textarea
          className="form-control border-primary"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="3"
          placeholder="Write the prompt here..."
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
        🚀 Submit all data
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default PromptPage;