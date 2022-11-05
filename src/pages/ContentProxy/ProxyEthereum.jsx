import React from 'react';
import { postMessageClient } from '../chrome/index';
import { Trans, Translation } from 'react-i18next';
import i18n from '../i18n/config';
import './ProxyEthereum.styles.scss';
import { getMiniAddress, convertHex2a, WRAPPER_CLASS_NAME, resolveLinkOnEtherscan, resolveChainSymbol } from './utils.js'
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';

const hexMap = {
    '0x095ea7b3': 'approve',
    '095ea7b3': 'approve',
    '0xa22cb465': 'setApprovalForAll',
    'a22cb465': 'setApprovalForAll',
    '0xa9059cbb': 'transfer',
    'a9059cbb': 'transfer',
    '0x42842e0e': 'safeTransferFrom',
    '42842e0e': 'safeTransferFrom',
    '0x23b872dd': 'transferFrom',
    '23b872dd': 'transferFrom'
};

const signTypedDataArr = ['eth_signTypedData', 'eth_signTypedData_v1', 'eth_signTypedData_v2', 'eth_signTypedData_v3', 'eth_signTypedData_v4'];

const postMessageToCurrentPage = (decision) => {
    const msg = { msg_key: 'user_decision', value: decision };
    postMessageClient.postMsg(msg);
};

const methodsActionList = Object.values(hexMap)

export default class ProxyEthereum extends React.Component {
    constructor(props) {
        super(props)
        this.container = null;
        this.initState = {
            domainSafeType: 'warning',
            contractSafeType: 'warning',
            contractName: '',
            contractAddress: '',
            tokenAddress: '',
            action: '',
            tokenId: '',
            isContractTransfer: false,
            sendNumber: 0,
            isNative: false,
            tokenInfo: { symbol: '' },
            isContractAddress: true,
            actionName: '',
            isOpensource: '',
            chainId: 1
        }
        this.listData = {
            contract_blacklist: [],
            contract_whitelist: [],
            domain_blacklist: [],
            domain_whitelist: []
        }
        this.state = this.initState

        window.addEventListener("message", (e) => {
            if (e.data.target && e.data.target === 'cointool-inpage') {
                let data = e.data.data
                if (data) {
                    this.listData = data
                }
                console.log('contract_blacklist.length', this.listData.contract_blacklist.length);
            }
        }, false);
    }
    getActionInfo(constList) {
        console.log('constList.method', constList.method)
        if (typeof constList.method !== 'undefined') {
            if (constList.method === 'eth_sendTransaction') {
                const data = constList.params[0].data
                let hexStr = ''
                if (typeof data !== 'undefined') {
                    const substringLen = data.substring(0, 2) === '0x' ? 10 : 8
                    hexStr = data.substring(0, substringLen)
                }
                const functionName = hexMap[hexStr];
                if (methodsActionList.includes(functionName)) {
                    return { result: true, action: functionName };
                }
                if ((data === '0x' || data == '' || typeof data === 'undefined') && parseInt(constList.params[0].value) > 0) {
                    return { result: true, action: 'transfer', isNative: true };
                } else if (typeof data !== 'undefined' && data !== '' && data !== '0x' && parseInt(constList.params[0].value) > 0 && !methodsActionList.includes(functionName)) {
                    return { result: true, action: 'transfer', isContractTransfer: true };
                }
            } else if (['eth_sign'].includes(constList.method)) {
                return { result: true, action: 'eth_sign' };
            } else if (signTypedDataArr.includes(constList.method)) {
                return { result: true, action: 'eth_signTypedData' };
            }
        }
        return { result: false };
    }

    async getTokenInfo(_address = '') {
        let data = {
            symbol: '',
        }
        try {
            const symbol = await window.ethereum.request({
                method: 'eth_call',
                params: [{ 'to': _address, 'data': '0x95d89b41' }, 'latest'],
            });

            if (symbol === '0x') {
                data.symbol = getMiniAddress(_address)
            } else {
                data.symbol = convertHex2a(symbol.toString().substr(130));
            }
        } catch (error) {
            console.log(error);
        }
        this.setState({
            tokenInfo: data
        })
    }

    showContainer() {
        const contentStyle = 'display: block;';
        document.querySelector(`#${WRAPPER_CLASS_NAME}`).setAttribute('style', contentStyle);
    }

    hideContainer() {
        this.setState({
            ...this.initState
        })
        const contentStyle = 'display: none;';
        document.querySelector(`#${WRAPPER_CLASS_NAME}`).setAttribute('style', contentStyle);
    }

    onCancelApprove() {
        postMessageToCurrentPage('block');
        this.hideContainer()
    }

    onNext() {
        postMessageToCurrentPage('continue');
        this.hideContainer()
    }

    async getDomainSafeType(_domain = '') {
        const { domain_blacklist, domain_whitelist } = this.listData
        let result = 'warning'
        domain_whitelist.forEach(item => {
            let domain = item.split('.').slice(-2).join('.')
            // if (['web.app', 'github.io'].includes(domain)) {
            //     domain = item
            // }
            if (domain.toLowerCase() === _domain.toLowerCase()) {
                result = 'success'
            }
        })
        domain_blacklist.forEach(item => {
            let domain = item.split('.').slice(-2).join('.')
            if (['web.app', 'github.io'].includes(domain)) {
                domain = item
            }
            if (domain === _domain.toLowerCase()) {
                result = 'danger'
            }
        })
        return result
    }

    async getContractSafeType(_address = '') {
        const { contract_blacklist, contract_whitelist } = this.listData
        let result = 'warning'
        contract_whitelist.forEach(item => {
            if (String(item.address).toLowerCase() === _address.toLowerCase()) {
                this.setState({
                    contractName: item.name
                })
                result = 'success'
            }
        })
        contract_blacklist.forEach(item => {
            if (String(item.address).toLowerCase() === _address.toLowerCase()) {
                this.setState({
                    contractName: item.name
                })
                result = 'danger'
            }
        })
        return result
    }

    async isContractAddress(_address = '') {
        if (_address === '') {
            return true
        }
        const code = await window.ethereum.request({
            method: 'eth_getCode',
            params: [_address, 'latest'],
        });
        this.setState({
            isContractAddress: code !== '0x'
        })
    }

    async getContractIsOpenSource(_address = '') {
        this.setState({
            isOpensource: true
        })
    }

    initEthereumProxy() {
        const that = this;
        // init proxy
        const handler = {
            async apply(target, thisArg, argumentsList) {
                console.log('apply')
                const constList = [...argumentsList][0];
                console.log('constList', constList)
                const transInfo = that.getActionInfo(constList)
                const isNotable = transInfo.result;
                const actionName = transInfo.action;
                let action = ''
                if (['approve', 'setApprovalForAll'].includes(actionName)) {
                    action = 'approve'
                } else if (['eth_sign'].includes(actionName)) {
                    action = 'eth_sign'
                } else if (signTypedDataArr.includes(actionName)) {
                    action = 'eth_signTypedData'
                } else {
                    action = 'transfer'
                }

                const isNative = transInfo.isNative;
                const isContractTransfer = transInfo.isContractTransfer;
                const chainId = parseInt(window.ethereum.chainId)

                if (isNotable) {
                    let contractAddress = ''
                    let tokenId = ''
                    let tokenAddress = ''
                    let sendNumber = 0;
                    if (isContractTransfer) {
                        sendNumber = parseInt(constList.params[0].value) / 1e18
                    }

                    if (['approve'].includes(actionName)) {
                        const reg = RegExp(/095ea7b3000000000000000000000000([a-fA-F0-9]{40})([a-fA-F0-9]{64})/);
                        const matchArr = constList.params[0].data.match(reg);
                        contractAddress = `0x${matchArr[1]}`
                        if (matchArr[2] === '0000000000000000000000000000000000000000000000000000000000000000') {
                            //Revoked
                            return target(...argumentsList);
                        }
                        //token approve
                    }
                    if (['setApprovalForAll'].includes(actionName)) {
                        const reg = RegExp(/a22cb465000000000000000000000000([a-fA-F0-9]{40})([a-fA-F0-9]{64})/);
                        const matchArr = constList.params[0].data.match(reg);
                        contractAddress = `0x${matchArr[1]}`
                        if (matchArr[2] === '0000000000000000000000000000000000000000000000000000000000000000') {
                            //Revoked
                            return target(...argumentsList);
                        }
                        //nft approve
                    }

                    if (['transfer'].includes(actionName)) {
                        if (isNative || isContractTransfer) {
                            contractAddress = constList.params[0].to
                            if (isContractTransfer && contractAddress == null) {
                                return target(...argumentsList);
                            }
                        } else {
                            const reg = RegExp(/a9059cbb000000000000000000000000([a-fA-F0-9]{40})([a-fA-F0-9]{64})/);
                            const matchArr = constList.params[0].data.match(reg);
                            contractAddress = `0x${matchArr[1]}` //receive address
                        }
                        //token transfer
                    }

                    if (['safeTransferFrom'].includes(actionName)) {
                        const reg = RegExp(/42842e0e000000000000000000000000([a-fA-F0-9]{40})([a-fA-F0-9]{64})([a-fA-F0-9]{64})/);
                        const matchArr = constList.params[0].data.match(reg);
                        const receiveAddress = matchArr[2].replace("000000000000000000000000", "")
                        contractAddress = `0x${receiveAddress}`//receive address
                        tokenId = parseInt(matchArr[3], 16)
                        //nft transfer
                    }
                    if (['transferFrom'].includes(actionName)) {
                        const reg = RegExp(/23b872dd000000000000000000000000([a-fA-F0-9]{40})([a-fA-F0-9]{64})([a-fA-F0-9]{64})/);
                        const matchArr = constList.params[0].data.match(reg);
                        const receiveAddress = matchArr[2].replace("000000000000000000000000", "")
                        contractAddress = `0x${receiveAddress}`//receive address
                        tokenId = parseInt(matchArr[3], 16)
                        //nft transfer
                    }

                    let domain = document.domain.split('.').slice(-2).join('.');
                    if (['web.app', 'github.io'].includes(domain)) {
                        domain = document.domain
                    }
                    const domainSafeType = await that.getDomainSafeType(domain)
                    // console.log(domainSafeType)

                    if (actionName !== 'eth_sign' && actionName !== 'eth_signTypedData') {
                        tokenAddress = constList.params[0].to;
                    }
                    const contractSafeType = await that.getContractSafeType(contractAddress)
                    that.isContractAddress(contractAddress)
                    that.getContractIsOpenSource(contractAddress)
                    if (isNative || isContractTransfer) {
                        const symbol = resolveChainSymbol(chainId)
                        that.setState({
                            tokenInfo: { symbol }
                        })
                    } else {
                        that.getTokenInfo(tokenAddress)
                    }

                    if (domainSafeType === 'success' && contractSafeType === 'success') {
                        return target(...argumentsList);
                    } else {
                        setTimeout(() => {
                            that.showContainer()
                        }, 300)
                        that.setState({
                            domainSafeType,
                            contractSafeType,
                            contractAddress,
                            isContractTransfer,
                            sendNumber,
                            tokenAddress,
                            isNative,
                            actionName,
                            action,
                            tokenId,
                            chainId
                        })
                        const decisionData = await postMessageClient.listenDecision();

                        if (decisionData.value === 'continue') {
                            return target(...argumentsList);
                        } else {
                            throw { code: 4001, message: 'MetaMask Tx Signature: User denied transaction signature.' }
                        }
                    }
                } else {
                    return target(...argumentsList);
                }
            }
        };
        let proxyInterval
        function proxyETH() {
            if (typeof window.ethereum !== 'undefined') {
                console.log('find ethereum');
                const proxy1 = new Proxy(window.ethereum.request, handler);
                window.ethereum.request = proxy1;
                clearInterval(proxyInterval);
            } else if (typeof window.web3 !== 'undefined') {
                console.log('find web3');
                const proxy2 = new Proxy(window.web3.currentProvider, handler);
                window.web3.currentProvider = proxy2;
                clearInterval(proxyInterval);
            } else {
                console.log('not find ethereum or web3');
            }
        }
        // proxyETH()
        proxyInterval = setInterval(proxyETH(), 1000);
        setTimeout(() => { clearInterval(proxyInterval); }, 10000);
    }
    async componentDidMount() {
        this.initEthereumProxy();
    }
    getResultIcon(_type = 'warning') {
        const map = {
            'danger': <CloseCircleOutlined />,
            'success': <CheckCircleOutlined />,
            'warning': <ExclamationCircleOutlined />,
        }
        return map[_type]
    }
    render() {
        const { contractName, contractAddress, domainSafeType, sendNumber, isContractTransfer, action, isContractAddress, chainId, contractSafeType, isNative, actionName, tokenAddress, isOpensource, tokenId, tokenInfo } = this.state
        const isNFT = ['setApprovalForAll', 'safeTransferFrom', 'transferFrom'].includes(actionName)
        const isDanger = domainSafeType === 'danger' || contractSafeType === 'danger' || (action === 'approve' && !isContractAddress);
        const tokenIdText = tokenId ? ` #${tokenId}` : ''
        const link = resolveLinkOnEtherscan(chainId)
        return (
            <Translation>
                {t => (
                    <div className={`dialog ${isDanger ? 'dialog-danger' : ''}`}>
                        <div className="dialog-header">
                            <div className="left">
                                <img src="https://cdn.jsdelivr.net/gh/c0deCn/wiki@master/logo.png" />
                            </div>
                            <div className="right">
                                <a
                                    className="title"
                                    href="https://cointool.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    CoinTool.App
                                </a>
                            </div>
                        </div>

                        <div className="dialog-content">
                            <p className="title">
                                <WarningOutlined className="tipIcon" />
                                <Trans i18nKey={`dialog.${action}_tips`} />
                            </p>

                            {/* <div className="descBox">

                            </div> */}

                            <div className="descBox">
                                <p className="p1">
                                    {actionName === 'eth_sign' ? <Trans i18nKey={`dialog.eth_sign_text_tips`} /> : ''}

                                    {actionName === 'eth_signTypedData' ? <Trans i18nKey={`dialog.eth_signTypedData_text_tips`} /> : ''}
                                    {!['eth_sign', 'eth_signTypedData'].includes(actionName) ?
                                        <Trans
                                            i18nKey={`dialog.${isContractTransfer ? 'contract_try_action' : 'try_action'}`}
                                            values={{
                                                type: isNFT ? 'NFT' : isNative ? '' : 'Token',
                                                action: t(`dialog.${action}`),
                                                sendNumber: sendNumber,
                                                symbol: `${tokenInfo.symbol}${tokenIdText}`
                                            }}
                                            components={[
                                                isNative ? <span></span> : <a
                                                    href={`${link}/address/${tokenAddress}`}
                                                    target="_blank"
                                                    className="symbol" rel="noreferrer"
                                                />
                                            ]}
                                        /> : ''
                                    }
                                </p>

                                {
                                    ['eth_sign', 'eth_signTypedData'].includes(actionName) ? '' :
                                        <div className={`addressBox ${contractSafeType === 'danger' ? 'address-danger' : ''}`}>
                                            <a href={`${link}/address/${contractAddress}`} className="addressLink" target="_blank" rel="noreferrer">{contractAddress}</a>
                                        </div>
                                }

                                <div className="addressInfo">
                                    <div className="leftBox"></div>
                                    <div className="rightBox">
                                        {
                                            contractName !== '' ?
                                                <div className={`tagBox tagBox-${contractSafeType}`}>
                                                    <span className="text">{contractName}</span>
                                                </div> : ''
                                        }

                                        {
                                            domainSafeType !== 'warning' ?
                                                <div className={`tagBox tagBox-${domainSafeType}`}>
                                                    {this.getResultIcon(domainSafeType)}
                                                    <span className="text">{
                                                        t(`dialog.address_${domainSafeType}`, {
                                                            type: t('dialog.domain')
                                                        })
                                                    }</span>
                                                </div> : ''
                                        }

                                        {
                                            ['eth_sign', 'eth_signTypedData'].includes(actionName) ? '' :
                                                <div className={`tagBox tagBox-${contractSafeType}`}>
                                                    {this.getResultIcon(contractSafeType)}
                                                    <span className="text">{
                                                        t(`dialog.address_${contractSafeType}`, {
                                                            type: isContractAddress ? t('dialog.contract') : t('dialog.address')
                                                        })
                                                    }</span>
                                                </div>
                                        }
                                    </div>
                                </div>

                                <p className="tips" style={{ display: ['eth_sign', 'eth_signTypedData'].includes(actionName) ? 'none' : 'block' }}>
                                    {
                                        action === 'approve' ?
                                            isContractAddress ?
                                                <Trans
                                                    values={{
                                                        action: t(`dialog.${action}`),
                                                    }}
                                                    i18nKey={`dialog.approve_${isDanger ? 'danger' : 'warning'}_tips`}
                                                /> : <Trans i18nKey="dialog.approve_private_address" />
                                            :
                                            isDanger ? <Trans i18nKey={`dialog.transfer_address_danger_tips`} />
                                                :
                                                isContractAddress ?
                                                    <Trans i18nKey={`dialog.transfer_address_contract_tips`} /> :
                                                    <Trans i18nKey={`dialog.transfer_address_private_tips`} />
                                    }
                                </p>

                            </div>


                            <div className="btnBox">
                                <button type="button" className="btn1" onClick={() => this.onCancelApprove()}>
                                    <Trans i18nKey="dialog.cancel" />
                                </button>
                                <button type="button" className="btn2" onClick={() => this.onNext()}>
                                    <Trans i18nKey="dialog.continue" />
                                </button>
                            </div>
                        </div>
                    </div >
                )}
            </Translation>
        );
    }
}
