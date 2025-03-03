export async function analyzeCampaign(formData) {
  console.log("Sending to /analyze:", Object.fromEntries(formData.entries()));
  try {
    const response = await fetch('http://127.0.0.1:5001/analyze', {
      method: 'POST',
      body: formData, // FormData handles multipart/form-data automatically
    });
    console.log("Response status:", response ? response.status : 'No response');
    console.log("Response headers:", response ? Object.fromEntries(response.headers.entries()) : 'No headers');
    if (!response.ok) {
      const errorText = await (response ? response.text() : Promise.resolve('No response body'));
      console.log("Error response:", errorText);
      throw new Error(`Failed to fetch: ${response ? response.status : 'Network error'} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (err) {
    console.error("Fetch error name:", err.name);
    console.error("Fetch error message:", err.message);
    console.error("Fetch error stack:", err.stack);
    console.error("Fetch error full:", err);
    console.error("Network info:", {
      hostname: window.location.hostname,
      port: 5000, // Or 5001 if switched
      protocol: window.location.protocol,
      isOnline: navigator.onLine,
    });
    throw err;
  }
}

  export async function createCampaign(formData) {
  console.log("Sending to /create_campaign:", Object.fromEntries(formData.entries()));
  try {
    const response = await fetch('http://127.0.0.1:5001/create_campaign', {
      method: 'POST',
      body: formData,
    });
    console.log("Response status:", response ? response.status : 'No response');
    if (!response.ok) {
      const errorText = await (response ? response.text() : Promise.resolve('No response body'));
      console.log("Error response:", errorText);
      throw new Error(`Failed to create campaign: ${response ? response.status : 'Network error'} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Created campaign data:", data);
    return data;
  } catch (err) {
    console.error("Create campaign error:", err);
    throw err;
  }
}