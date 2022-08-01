import { Dropdown, Menu } from 'antd';
import React from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next'
import { DownOutlined } from '@ant-design/icons';
// import { get, set } from '../chrome';
// import { postMessageClient } from '../chrome';

const changeLanguage = async ({ key }) => {
  i18n.changeLanguage(key); // en or zh
};

const menu = (
  <Menu
    onClick={changeLanguage}
    items={[
      {
        key: 'zh',
        label: (
          <span>中文</span>
        ),
      },
      {
        key: 'en',
        label: (
          <span>English</span>
        ),
      },
    ]}
  />
);

const App = () => {
  const { t } = useTranslation()
  return (
    <div className="langChange">
      <Dropdown overlay={menu} placement="bottomLeft" arrow trigger={['click']}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ fontSize: 14 }}>
          <span>{i18n.language}</span>
          <DownOutlined />
        </a>
      </Dropdown>
    </div>
  )
}

export default App;