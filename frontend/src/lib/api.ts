// API utility functions for authentication and data fetching

const API_URL = 'http://localhost:8000';

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.detail || error.message || 'Request failed. Please try again later.',
    status: error.status || 0
  };
};

// Register function
export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not valid JSON
        return { 
          error: true, 
          message: `Registration failed with status ${response.status}`, 
          status: response.status 
        };
      }
      console.log('Registration error response:', errorData);
      return { error: true, message: errorData.detail || errorData.message || 'Registration failed', status: response.status };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    // FastAPI expects username/password in form data format for OAuth2
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: true, message: errorData.detail || 'Login failed', status: response.status, data: errorData };
    }

    const data = await response.json();
    
    // Store the token in localStorage
    localStorage.setItem('token', data.access_token);
    
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { error: true, message: 'No authentication token', status: 401 };
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const errorData = await response.json();
      return { error: true, message: errorData.detail || 'Failed to get user data', status: response.status };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const updateUser = async (userData: { name: string; email: string }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: true, message: errorData.detail || 'Update failed', status: response.status };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export interface DeleteAccountResponse {
  error?: boolean;
  message?: string;
  data?: {
    token?: string;
  };
}

export const deleteUser = async (): Promise<DeleteAccountResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: true, message: errorData.detail || 'Deletion failed' };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export interface DeleteDocumentResponse {
  error?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
}

export const deleteDocument = async (documentId: number): Promise<DeleteDocumentResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: true, message: errorData.detail || 'Document deletion failed' };
    }

    const data = await response.json();
    return { error: false, data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};