console.log('background page.');

import { get, set } from '../chrome'
const maxTime = 30 * 60 * 1000 // 30min
class Background {
  constructor() {
    this.state = {
      target: 'cointool-inpage',
      data: null
    }
    this.t1 = null
    this.isCache = false
    this.init();
  }

  async getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  async getFetch(_type, _timeout = 5000) {
    const _url = `https://cdn.jsdelivr.net/gh/CoinTool-App/MetaSafe/data/json/${_type}.json?t=${new Date().getTime()}`
    async function fetchMoviesJSON() {
      try {
        const response = await fetch(_url);
        const movies = await response.json();
        return movies;
      } catch (error) {
        return []
      }
    }
    return Promise.race([
      fetchMoviesJSON(),
      new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error('request timeout')), _timeout)
      })])
      .then((data) => {
        return data
      }).catch(() => {
        return []
      });
  }

  async sendMessage() {
    this.getCurrentTab().then(currentTab => {
      if (currentTab) {
        chrome.tabs.sendMessage(currentTab.id, this.state)
      }
    })
      .catch(rejectedReason => {
        console.log(`sendMessage failed: ${rejectedReason}`)
      })
  }

  async getData() {
    let getDateLastTime = await get('getCoinToolDataDate')
    let coinToolListData = await get('coinToolListData')

    if (!getDateLastTime) {
      await set('getCoinToolDataDate', new Date().getTime())
      getDateLastTime = new Date().getTime()
    }

    // console.log('time1', new Date());
    // console.log('time2', new Date(getDateLastTime));

    let diffTime = new Date().getTime() - getDateLastTime
    if (diffTime < maxTime && coinToolListData) { // in 1h
      console.log('this.isCache', this.isCache);
      this.state.data = coinToolListData
      if (this.isCache === false) {
        this.sendMessage()
        this.isCache = true
      }
      // this.sendMessage()
    } else {
      console.log('req network');
      const [domain_whitelist, domain_blacklist, contract_whitelist, contract_blacklist] = await Promise.all([
        this.getFetch('domain_whitelist'),
        this.getFetch('domain_blacklist'),
        this.getFetch('contract_whitelist'),
        this.getFetch('contract_blacklist')
      ]);

      const res = {
        contract_blacklist,
        contract_whitelist,
        domain_blacklist,
        domain_whitelist
      }
      console.log(res, 'req data');
      await set('coinToolListData', res)
      await set('getCoinToolDataDate', new Date().getTime())
      this.state.data = res
      this.sendMessage()
    }
  }

  async init() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log('Click the current page to trigger');
      if (this.state.data) {
        chrome.tabs.sendMessage(tabId, this.state, function () {
          console.log("get responent");
        })
      }
    });

    if (this.t1) {
      clearInterval(this.t1)
    }
    this.getData()
    this.t1 = setInterval(() => {
      this.getData()
    }, 60 * 1000)
  }
}
new Background();
