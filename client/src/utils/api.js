// utils/api.js

// Base URL for your backend API
const API_BASE_URL = "http://localhost:5000/api";

// Helper function for POST requests
async function post(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // include cookies if your backend uses them
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

// Login function
export async function login(data) {
  return post("/auth/login", data);
}

// You can add more API functions here, for example:
export async function register(data) {
  return post("/auth/register", data);
}

export async function forgotPassword(data) {
  return post("/auth/forgot-password", data);
}

export async function getProfile(token) {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to fetch profile");
  return res.json();
}

export async function updateProfile(data, token) {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to update profile");
  return res.json();
}

export async function changePassword(data, token) {
  const res = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok)
    throw new Error((await res.json()).message || "Failed to change password");
  return res.json();
}
