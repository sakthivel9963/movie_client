import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { setCookies } from 'cookies-next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  useEffect(() => {
    localStorage.removeItem('login_cookie');
  }, []);

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const result = await axios.post(`${API_URL}/user_login`, data);
      const statusCode = result.status;
      console.log(result.data.data.id);
      localStorage.setItem('login_cookie', result.data.data.id);
      setCookies('login_cookie', result.data.data.id);
      setApiSuccess('User Login Success');
    } catch (error) {
      if (error.response.status === 500) {
        setApiError('server error');
      } else {
        setApiError(error.response.data.message);
      }
    }
  };

  return (
    <div className="login-form ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center">Log in</h2>
        <div className="mb-3">
          <input
            placeholder="Email"
            type="input"
            className="form-control"
            id="email"
            {...register('email')}
          />
          <span className="danger">{errors.email?.message}</span>
        </div>
        <div className="mb-3">
          <input
            placeholder="Password"
            type="password"
            className="form-control"
            id="password"
            {...register('password')}
          />
          <span className="danger">{errors.password?.message}</span>
        </div>
        <div className="mb-3">
          {apiError && <span className="danger">{apiError}</span>}
          {apiSuccess && <span className="success">{apiSuccess}</span>}
        </div>
        <div className="mx-auto">
          <button type="submit" className="btn btn-primary ">
            Submit
          </button>
        </div>
      </form>
      <p className="text-center">
        <Link href={`/Registration`}>Create an Account</Link>
      </p>
    </div>
  );
};

export default Login;
