import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LockOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

function LoginPage(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
  };

  const initialUsername = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <Formik
      initialValues={{
        username: initialUsername,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .min(2, t('login.usernameErr'))
          .required(t('login.usernameErr2')),
        password: Yup.string()
          .min(6, t('login.passwordErr'))
          .required(t('login.passwordErr2')),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            username: values.username,
            password: values.password
          };

          dispatch(loginUser(dataToSubmit))
            .then(response => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem('rememberMe', values.username);
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/landing");
              } else {
                setFormErrorMessage(t('login.formErr'))
              }
            })
            .catch(err => {
              setFormErrorMessage(t('login.formErr'))
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="loginbg">
            <div className="app login">
              <Title level={3}>{t('login.login')}</Title>
              <form onSubmit={handleSubmit} style={{ width: '350px' }}>

                <Form.Item required>
                  <Input
                    id="username"
                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                    placeholder={t('login.username')}
                    type="text"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.username && touched.username ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.username && touched.username && (
                    <div className="input-feedback">{errors.username}</div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)'}}/>}
                    placeholder={t('login.password')}
                    type="password"
                    autoComplete="off"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">{errors.password}</div>
                  )}
                </Form.Item>

                {formErrorMessage && (
                  <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
                )}

                <Form.Item>
                  <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >{t('login.remember')}</Checkbox>
                  <a className="login-form-forgot" href="/forgot" style={{ float: 'right' }}>
                    {t('login.forgot')}
                  </a>
                  <div>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                      {t('login.login')}
                    </Button>
                  </div>
                Or <a href="/register">{t('login.registernow')}</a>
                </Form.Item>

                <h3>{t('login.connect')}</h3>
                <div className="signWith">
                  <a href="http://localhost:5000/auth/42" className="fortytwo">
                    <div className="signLogo">
                      <img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_40/v1584997116/42_Logo_cdyubx.png" alt="logo42" />
                      {t('login.login42')}
                    </div>
                  </a>
                  <a href="http://localhost:5000/auth/google" className="google">
                    <div className="signLogo">
                      <img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_30/v1584996314/google_zcdxka.png" alt="logogoogle" />
                      {t('login.loginGoogle')}
                    </div>
                  </a>
                  <a href="http://localhost:5000/auth/instagram" className="instagram">
                    <div className="signLogo">
                      <img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_40/v1584995875/instagram_mqatvf.png" alt="logoInstagram" />
                      {t('login.loginInsta')}
                    </div>
                  </a>
                  <a href="http://localhost:5000/auth/github" className="github">
                    <div className="signLogo">
                      <img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_40/v1584995875/github_abhszf.png" alt="logogithub" />
                      {t('login.loginGit')}
                    </div>
                  </a>
                  <a href="http://localhost:5000/auth/discord" className="discord">
                    <div className="signLogo">
                      <img src="https://res.cloudinary.com/dkyqbngya/image/upload/c_scale,w_40/v1584997204/discord_ccalua.png" alt="logodiscord" />
                      {t('login.loginDiscord')}
                    </div>
                  </a>
                </div>


              </form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default withRouter(LoginPage);


