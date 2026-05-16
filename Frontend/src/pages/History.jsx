import { useEffect, useState } from "react";
import api from "../api/axios";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const loadHistory = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const res = await api.get(`/analyzer/history/${user.email}`);
    setHistory(res.data.scans);
  };

  useEffect(() => { loadHistory(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scan?")) return;
    try {
      await api.delete(`/analyzer/delete/${id}`);
      toast.success("Deleted");
      loadHistory();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="pt-24 p-6">
      <h2 className="text-2xl font-bold mb-4">Scan History</h2>

      {history.map(h => (
        <div
          key={h._id}
          className="mb-6 p-4 border rounded cursor-pointer"
          onClick={() =>
            navigate("/result", {
              state: {
                analysis: h,
                preview: `http://localhost:5000/${h.image}`
              }
            })
          }
        >
          <img src={`http://localhost:5000/${h.image}`} className="w-48 rounded" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(h._id);
            }}
            className="mt-2 px-4 py-1 border rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}