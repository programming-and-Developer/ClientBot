import { useState, useEffect } from "react"; // أضفت useEffect
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../utils/api";
export default function UploadImage() {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");
  const { user, selectedPage } = useAuth();

  useEffect(() => {
    if (selectedPage) {
      setMessage(""); // تنظيف الرسالة عند تغيير الصفحة
    }
  }, [selectedPage]);

  const handleUpload = async () => {
    if (!file || !productName || !selectedPage) {
      setMessage("❌ الرجاء اختيار صورة وإدخال اسم المنتج واختيار صفحة.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_name", productName);
    formData.append("pageId", selectedPage);
    console.log("📤 البيانات المرسلة إلى السيرفر:", [...formData]);
    setMessage("⏳ جاري رفع الصورة...");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setMessage(`✅ تم رفع الصورة بنجاح! الرابط: ${response.data.imageUrl}`);
    } catch (error) {
      console.error("❌ خطأ أثناء رفع الصورة:", error);
      setMessage("❌ حدث خطأ أثناء رفع الصورة.");
    }
  };

  return (
    <div className="container mt-5">
      <input
        type="text"
        placeholder="📝 Enter the product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="form-control border-dark mb-3 text-center"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-control border-dark mb-3"
      />
      <button onClick={handleUpload} className="btn btn-primary">
        📤 Upload the image
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}