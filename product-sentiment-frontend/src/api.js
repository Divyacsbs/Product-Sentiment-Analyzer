const API_BASE_URL = "http://127.0.0.1:5000";

export async function analyzeProduct(productURL) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_url: productURL, // 🔥 matches backend
    }),
  });

  if (!response.ok) {
    throw new Error("Backend error");
  }

  return await response.json();
}