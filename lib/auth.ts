import { signup as apiSignup, login as apiLogin, SignupResponse, LoginResponse } from './api';

// --- 기존 모의 구현 (유지) ---

export interface User {
  code: string;
  nickname: string;
}

export const generateSecretCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const MOCK_DB_KEY = 'docuquiz_users';

export const saveUser = async (code: string, nickname: string): Promise<boolean> => {
  try {
    const users = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
    users[code] = { code, nickname };
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Failed to save user', error);
    return false;
  }
};

export const loginWithCode = async (code: string): Promise<boolean> => {
  const isValid = /^[A-Z0-9]{10}$/.test(code);
  if (isValid) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = JSON.parse(localStorage.getItem(MOCK_DB_KEY) || '{}');
    const user = users[code];
    localStorage.setItem('auth_token', code);
    if (user) {
      localStorage.setItem('user_nickname', user.nickname);
    }
    return true;
  }
  return false;
};

// --- 신규 API 연동 함수 ---

/**
 * [API 연동] 사용자 등록 및 토큰 발급 (익명 로그인 개념)
 * @param displayName 사용자 표시 이름 (선택 사항)
 */
export const signUpUser = async (displayName?: string): Promise<SignupResponse> => {
  const response = await apiSignup(displayName);
  localStorage.setItem('auth_token', response.token);
  localStorage.setItem('user_id', response.userId);
  if (displayName) {
    localStorage.setItem('user_display_name', displayName);
  }
  return response;
};

/**
 * [API 연동] 토큰 검증 및 사용자 정보 반환 (로그인)
 * @param token 발급받은 API Token
 */
export const loginUser = async (token: string): Promise<LoginResponse> => {
  const response = await apiLogin(token);
  localStorage.setItem('auth_token', response.token);
  localStorage.setItem('user_id', response.userId);
  localStorage.setItem('user_display_name', response.displayName);
  return response;
};


// --- 공통 유틸리티 함수 ---

/**
 * 현재 로그인 상태인지 확인
 * @returns 로그인 여부
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
};

/**
 * 로그아웃 처리
 * (신규/기존 모든 인증 정보를 제거하도록 수정)
 */
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_nickname'); // 기존 mock
    localStorage.removeItem('user_id'); // 신규
    localStorage.removeItem('user_display_name'); // 신규
  }
};

/**
 * 사용자 표시 이름 가져오기 (신규 API 기준)
 * @returns 사용자 표시 이름 또는 null
 */
export const getUserDisplayName = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_display_name');
};

/**
 * 사용자 표시 이름 가져오기 (기존 Mock 기준)
 */
export const getUserNickname = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_nickname');
};

/**
 * 사용자 ID 가져오기 (신규 API 기준)
 * @returns 사용자 ID 또는 null
 */
export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_id');
};
