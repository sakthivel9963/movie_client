import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8)
      .max(16)
      .required()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
      ),
    name: yup.string().required(),
    mobile: yup.number().typeError('Must be a number').required(),
    county: yup.string(),
    city: yup.string(),
    state: yup.string(),
    message: yup.string(),
  })
  .required();

const Registration = () => {
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
  });
  const onSubmit = async (data) => {
    setApiError('');
    setApiSuccess('');
    try {
      const result = await axios.post(`${API_URL}/add_user`, data);
      const statusCode = result.status;
      setApiSuccess('User Created');
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
        <h2 className="text-center">Registration</h2>
        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="email"
            placeholder="Email"
            {...register('email')}
          />
          <span className="danger">{errors.email?.message}</span>
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            {...register('password')}
          />
          <span className="danger">{errors.password?.message}</span>
        </div>
        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="name"
            placeholder="Name"
            {...register('name')}
          />
          <span className="danger">{errors.name?.message}</span>
        </div>
        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="mobile"
            placeholder="Mobile"
            {...register('mobile')}
          />
          <span className="danger">{errors.mobile?.message}</span>
        </div>

        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="county"
            placeholder="County"
            {...register('county')}
          />
          <span className="danger">{errors.county?.message}</span>
        </div>

        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="city"
            placeholder="City"
            {...register('city')}
          />
          <span className="danger">{errors.city?.message}</span>
        </div>

        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="state"
            placeholder="State"
            {...register('state')}
          />
          <span className="danger">{errors.state?.message}</span>
        </div>

        <div className="mb-3">
          <input
            type="input"
            className="form-control"
            id="message"
            placeholder="Message"
            {...register('message')}
          />
          <span className="danger">{errors.message?.message}</span>
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
        <Link href={`/Login`}>Go To Login</Link>
      </p>
    </div>
  );
};

export default Registration;
