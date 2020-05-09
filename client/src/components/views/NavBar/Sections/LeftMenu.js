import React from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';


function LeftMenu(props) {
  const { t } = useTranslation();
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="">
      <a href="/favorite">{t('navbar.favorites')}</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu