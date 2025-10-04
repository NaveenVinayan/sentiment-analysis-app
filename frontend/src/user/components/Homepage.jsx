import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../utils/Loading'

const Homepage = () => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/feedback`, { rating, comments, suggestions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.data.success) {
        toast.success('Feedback submitted successfully')
      }

    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ?
        (
          <Loading />
        ) : (
          <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 ">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Submit Your Feedback
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Please share your experience of the platform, which helps to improve!
              </p>

           
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`px-3 py-2 rounded-full border transition ${rating >= num
                          ? "bg-yellow-400 text-white border-yellow-400"
                          : "border-gray-300 text-gray-600 hover:bg-yellow-100"
                          }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Comments <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none"
                    placeholder="Share your experience..."
                    rows="4"
                  ></textarea>
                </div>

                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Suggestions (Optional)
                  </label>
                  <textarea
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none"
                    placeholder="Any suggestions for improvement?"
                    rows="3"
                  ></textarea>
                </div>

                
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-white font-semibold transition bg-teal-600 hover:bg-teal-700`}
                >Submit
                </button>
              </form>
            </div>
          </div>
        )
      }
    </>

  )
}

export default Homepage
