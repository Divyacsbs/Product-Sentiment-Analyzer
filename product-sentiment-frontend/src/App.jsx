import { useState } from "react";
import { analyzeProduct } from "./api";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    if (!url) {
      alert("Please enter Snapdeal product URL");
      return;
    }

    setLoading(true);

    try {
      const result = await analyzeProduct(url);
      setData(result);
      setShowDashboard(true);
    } catch (error) {
      alert("Backend error. Is Flask running?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sentiment = data?.sentiment_distribution;

  const pieData =
    sentiment && {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [
        {
          data: [
            sentiment.Positive,
            sentiment.Negative,
            sentiment.Neutral,
          ],
          backgroundColor: ["#4ade80", "#f87171", "#fde047"],
          borderWidth: 0,
        },
      ],
    };

  const barData =
    sentiment && {
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [
        {
          label: "Number of Reviews",
          data: [
            sentiment.Positive,
            sentiment.Negative,
            sentiment.Neutral,
          ],
          backgroundColor: "#7dd3fc",
          borderRadius: 6,
        },
      ],
    };

  const totalReviews =
    sentiment &&
    sentiment.Positive + sentiment.Negative + sentiment.Neutral;

  return (
    <div className="app">
      {!showDashboard ? (
        <div className="input-box">
          <h1>Product Sentiment Analyzer</h1>

          <input
            type="text"
            placeholder="Enter Snapdeal product URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      ) : (
        <div className="dashboard">
          <h1 className="title">Product Sentiment Dashboard</h1>
          <p className="url">{url}</p>

          <div className="stats">
            <div className="stat-card">
              <h3>Total Reviews</h3>
              <p>{data.total_reviews}</p>
            </div>

            <div className="stat-card">
              <h3>Overall Suggestion</h3>
              <p>
                {sentiment.Positive / totalReviews > 0.5
                  ? "Recommended"
                  : "Mixed Opinions"}
              </p>
            </div>
          </div>

          <div className="charts">
            <div className="chart-card">
              <h3>Sentiment Distribution</h3>
              <div className="chart-wrapper">
                <Pie data={pieData} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Sentiment Comparison</h3>
              <div className="chart-wrapper">
                <Bar data={barData} />
              </div>
            </div>
          </div>

          <div className="top-words">
            <h3>Top Review Words</h3>
            <ul>
              {data.top_words.map((item, index) => (
                <li key={index}>
                  {item[0]} <span>({item[1]})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;