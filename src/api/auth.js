// File: src/api/auth.js

import api from './axios'

/**
 * LOGIN EMAIL + PASSWORD
 */
export const login = async (email, password) => {
  const response = await api.post('/api/login', {
    login: email,
    password,
  })

  const token = response.data.token
  const user = response.data.user

  if (token) {
    localStorage.setItem('auth_token', token)
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  return response.data
}

/**
 * LOGIN OTP
 */
export const loginWithOtp = async (phone, otp) => {
  const response = await api.post('/api/auth/verify-otp', {
    phone,
    otp,
  })

  const token = response.data.token
  const user = response.data.user

  if (token) {
    localStorage.setItem('auth_token', token)
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  return response.data
}

/**
 * REQUEST OTP
 */
export const requestOtp = async (phone) => {
  const response = await api.post('/api/auth/request-otp', {
    phone,
  })

  return response.data
}

/**
 * LOGOUT
 */
export const logout = async () => {
  try {
    await api.post('/api/logout')
  } catch (err) {
    console.warn('Logout warning:', err)
  } finally {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }
}

/**
 * GET USER
 */
export const getUser = async () => {
  const response = await api.get('/api/user')

  return response.data
}

/**
 * CHECK AUTH
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token')
}

/**
 * STORED USER
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user')

  return user ? JSON.parse(user) : null
}