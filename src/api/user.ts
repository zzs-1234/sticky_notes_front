import request from './request';

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export const userApi = {
  login(data: LoginForm) {
    return request.post('/auth/login', data);
  },

  register(data: RegisterForm) {
    return request.post('/auth/register', data);
  }
}; 