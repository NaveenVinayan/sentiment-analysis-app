import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { user } = useAuth()
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/feedbacks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.data.success) {
          setFeedbacks(response.data.feedbacks);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeedbacks();
  }, []);



  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Comments</th>
              <th className="px-4 py-3 text-left">Suggestions</th>
              <th className="px-4 py-3 text-left">Predicted Emotion</th>
              <th className="px-4 py-3 text-left">Timestamp</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {feedbacks.length > 0 ? (
              feedbacks.map((f, index) => (
                <tr key={f.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {f.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{f.rating} ⭐</td>
                  <td className="px-4 py-3">{f.comments}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {f.suggestions || "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
    ${f.predicted_emotion === "happiness"
                          ? "bg-green-100 text-green-700"
                          : f.predicted_emotion === "anger"
                            ? "bg-red-100 text-red-700"
                            : f.predicted_emotion === "sadness"
                              ? "bg-blue-100 text-blue-700"
                              : f.predicted_emotion === "love"
                                ? "bg-pink-100 text-pink-700"
                                : f.predicted_emotion === "hate"
                                  ? "bg-rose-100 text-rose-700"
                                  : f.predicted_emotion === "neutral"
                                    ? "bg-gray-100 text-gray-700"
                                    : f.predicted_emotion === "fun"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : f.predicted_emotion === "enthusiasm"
                                        ? "bg-orange-100 text-orange-700"
                                        : f.predicted_emotion === "relief"
                                          ? "bg-teal-100 text-teal-700"
                                          : f.predicted_emotion === "surprise"
                                            ? "bg-purple-100 text-purple-700"
                                            : f.predicted_emotion === "boredom"
                                              ? "bg-lime-100 text-lime-700"
                                              : f.predicted_emotion === "empty"
                                                ? "bg-slate-100 text-slate-700"
                                                : f.predicted_emotion === "worry"
                                                  ? "bg-amber-100 text-amber-700"
                                                  : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {f.predicted_emotion}
                    </span>

                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(f.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No feedbacks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default AdminDashboard