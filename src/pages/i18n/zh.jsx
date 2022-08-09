const translation_zh = {
    dialog: {
        danger: '危险',
        success: '安全',
        warning: '警告',
        address: '钱包地址',
        contract: '合约',
        domain: '域名',
        address_danger: '{{type}}黑名单',
        address_success: '{{type}}白名单',
        address_warning: '未知地址',

        open_source: '合约已开源',
        not_open_source: '合约未开源',
        approve: '授权',
        transfer: '发送',
        approve_tips: '授权提示',
        transfer_tips: '转账提示',
        eth_sign_tips: '签名提示',
        eth_sign_text_tips: '警告！你正在签名，可能会转移你所有资产！请确认网站是可信的',
        cancel: '取消操作',
        continue: '继续操作',
        try_action: '你正试图将 {{type}} <0>{{symbol}}</0> {{action}}给',
        contract_try_action: '您正在调用合约并发送 {{sendNumber}} {{symbol}} 给',

        transfer_address_private_tips: '你正试图转移资产，接收地址是一个私人地址，请确认是您可信的地址',
        transfer_address_contract_tips: '你正试图转移资产，接收地址是一个合约地址，请确认是您可信的合约',
        transfer_address_danger_tips: '当前接收地址或网站存在CoinTool黑名单中,请不要转移！',
        approve_warning_tips: '当前网站或合约不存在 CoinTool 的白名单中，此合约有可能转移你的资产，请自行判断是否继续{{action}}！',
        approve_danger_tips: '当前网站或合约存在 CoinTool 的黑名单中，此合约极有可能转移你的资产，请不要{{action}}！',
        approve_private_address: '危险！此地址不是一个合约，而是一个私人钱包地址！此地址极有可能转移你的资产，请不要授权！',
    },
    popup: {
        safeing: '正在保护你的资产...',
        submit_list: '提交黑名单或者白名单',
        check_approve: '检测钱包授权',
    }
};

export default translation_zh;
