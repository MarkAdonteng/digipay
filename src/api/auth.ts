export interface UserData {
  username: string;
  password: string;
  phone_number: string;
  security_question: string;
  security_answer: string;
}

export const createUser = async (userData: UserData) => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

export const verifyPhoneAndGetSecurityQuestion = async (phoneNumber: string) => {
  try {
    console.log('Sending phone number to verify:', phoneNumber); // Debug log
    
    const response = await fetch('http://localhost:3000/api/users/verify-phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    const data = await response.json();
    console.log('Server response:', data); // Debug log
    
    if (!data.success) {
      throw new Error(data.message);
    }

    return data.securityQuestion;
  } catch (error) {
    console.error('API error:', error); // Debug log
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
};

export const verifySecurityAnswer = async (phoneNumber: string, answer: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/verify-security', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone_number: phoneNumber,
        security_answer: answer 
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }

    return data.success;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
};

export const resetPassword = async (phoneNumber: string, newPassword: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        phone_number: phoneNumber,
        new_password: newPassword 
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }

    return data.success;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
};

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    phone_number: string;
  };
  message?: string;
}

export const verifyLogin = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server error: Invalid response format');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
}; 