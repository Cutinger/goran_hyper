/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { LogoutOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

function RightMenu(props) {

  const { t, i18n } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };
  let language = i18n.language;

  function onChange(e) {
    changeLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  }

  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">{t('navbar.login')}</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">{t('navbar.register')}</a>
        </Menu.Item>
        <Menu.Item key="flagFR">
          <select defaultValue={language} onChange={onChange}>
            <option value="en">{t("navbar.lngEN")}</option>
            <option value="fr">{t("navbar.lngFR")}</option>
          </select>
        </Menu.Item>
      </Menu>
    )
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="profile">
          <a href="/profile">{t('navbar.profile')}</a>
        </Menu.Item>
        <Menu.Item key="users">
          <a href="/users">{t('navbar.users')}</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}><LogoutOutlined />{t('navbar.logout')}</a>
        </Menu.Item>
        <Menu.Item key="flagFR">
          <select defaultValue={language} onChange={onChange}>
            <option value="en">{t("navbar.lngEN")}</option>
            <option value="fr">{t("navbar.lngFR")}</option>
          </select>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);

