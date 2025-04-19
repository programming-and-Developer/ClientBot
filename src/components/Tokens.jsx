import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTokens } from "../context/TokenContext";
import API_BASE_URL from "../utils/api";
function Tokens() {
  const { user, pages, selectedPage } = useAuth();
  const { inputTokens, setInputTokens, outputTokens, setOutputTokens } = useTokens();
  const [localInputTokens, setLocalInputTokens] = useState(inputTokens.toString());
  const [localOutputTokens, setLocalOutputTokens] = useState(outputTokens.toString());
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedPage) {
      const currentPage = pages.find(p => p.pageId === selectedPage);
      if (currentPage) {
        const newInputTokens = currentPage.botSettings.inputTokens || 30;
        const newOutputTokens = currentPage.botSettings.outputTokens || 20;
        setLocalInputTokens(newInputTokens.toString());
        setLocalOutputTokens(newOutputTokens.toString());
        setInputTokens(newInputTokens);
        setOutputTokens(newOutputTokens);
        setMessage(""); // تنظيف الرسالة عند تغيير الصفحة
      }
    }
  }, [selectedPage, pages, setInputTokens, setOutputTokens]);

  const handleOutputBlur = async () => {
    const input = parseInt(localInputTokens);
    const output = parseInt(localOutputTokens);
    if (!isNaN(input) && !isNaN(output)) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/pages/update-settings/${selectedPage}`,
          {
            inputTokens: input,
            outputTokens: output,
          },
          { withCredentials: true }
        );
        setInputTokens(input); // تحديث TokenContext
        setOutputTokens(output); // تحديث TokenContext
        const updatedPages = pages.map(p =>
          p.pageId === selectedPage
            ? { ...p, botSettings: { ...p.botSettings, inputTokens: input, outputTokens: output } }
            : p
        );
        localStorage.setItem("cachedPages", JSON.stringify(updatedPages));
        setMessage("✅ تم حفظ التوكنز بنجاح!");
      } catch (error) {
        console.error("❌ خطأ أثناء الإرسال:", error);
        setMessage("❌ حدث خطأ أثناء حفظ التوكنز.");
      }
    } else {
      setMessage("❌ الرجاء إدخال أرقام صحيحة للتوكنز.");
    }
  };

  return (
    <div className="container">
      <div className="form-group mt-3">
        <label className="fw-bold mb-2">🔡 Input Tokens:</label>
        <input
          type="number"
          className="form-control border-warning"
          value={localInputTokens}
          onChange={(e) => setLocalInputTokens(e.target.value)}
          placeholder="Input Tokens..."
        />
      </div>
      <div className="form-group mt-3">
        <label className="fw-bold mb-2">🔠 Output Tokens:</label>
        <input
          type="number"
          className="form-control border-success"
          value={localOutputTokens}
          onChange={(e) => setLocalOutputTokens(e.target.value)}
          onBlur={handleOutputBlur}
          placeholder="Output Tokens..."
        />
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default Tokens;