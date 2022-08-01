import React from 'react';
import logo from '../../assets/img/logo.png';
import { Trans, withTranslation } from 'react-i18next';
import LangChange from './LangChange'
import { GithubOutlined, TwitterOutlined, GlobalOutlined, LinkOutlined, CommentOutlined } from '@ant-design/icons';
import './Popup.scss';
import { go } from '../chrome/index'

const Popup = ({ t }) => {
  return (
    <div className="App">
      <div className="content">

        <LangChange />
        <img src={logo} className="logo" alt="logo" />

        <h1>
          <a
            className="title"
            href="https://cointool.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            CoinTool.App
          </a>
        </h1>

        <p className='desc'>
          <i className="liveIcon" />
          <span>
            <Trans i18nKey={`popup.safeing`} />
          </span>
        </p>

        {/* <Switch defaultChecked onChange={onChange} /> */}

        <button type="button" onClick={() => go('https://cointool.app/approve/eth')} className="btn">
          {t('popup.check_approve')}
        </button>
      </div>

      <div className="footer">
        <div className="footer-left">
          <a
            href="https://github.com/CoinTool-App/MetaSafe/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkOutlined className="icon" />
            {t('popup.submit_list')}
          </a>
        </div>
        <div className="footer-right">
          <CommentOutlined className="icon" onClick={() => go('mailto:cointools@outlook.com')} />
          <GlobalOutlined className="icon" onClick={() => go('https://cointool.app')} />
          <GithubOutlined className="icon" onClick={() => go('https://github.com/cointool-app/MetaSafe')} />
          <TwitterOutlined className="icon" onClick={() => go('https://twitter.com/cointool')} />
        </div>

      </div>

    </div>
  );
};

export default withTranslation()(Popup);
