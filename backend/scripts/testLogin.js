const testLogin = async () => {
  try {
    console.log("Testing POST /api/v1/auth/login...");
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'vishnu24.igm@gmail.com',
        password: 'vishnu@9121'
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login Failed');
    }
    console.log("[+] Login successful!");
    console.log("Access Token:", data.data.accessToken);
    console.log("User Data:", data.data.user);
  } catch (error) {
    console.error("[-] Login failed:", error.message);
  }
};

testLogin();
