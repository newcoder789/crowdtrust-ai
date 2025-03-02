export async function analyzeCampaign(formData) {
  console.log("Sending to /analyze:", Object.fromEntries(formData));
  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
      mode: 'cors',  // Explicitly set CORS mode
      credentials: 'include',  // Include cookies if needed
    });
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (err) {
    console.error("Fetch error name:", err.name);
    console.error("Fetch error message:", err.message);
    console.error("Fetch error stack:", err.stack);
    console.error("Fetch error full:", err);
    throw err;
  }
}

export async function createCampaign(formData) {
  console.log("Sending to /create_campaign:", Object.fromEntries(formData));
  try {
    const response = await fetch('http://localhost:5000/create_campaign', {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'include',
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Failed to create campaign: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Created campaign data:", data);
    return data;
  } catch (err) {
    console.error("Create campaign error:", err);
    throw err;
  }
}