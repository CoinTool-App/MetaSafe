import './content.styles.css';
import { WRAPPER_CLASS_NAME } from '../ContentProxy/utils'
export default class ContentScripts {
    constructor() {
        this.container = null;
        this.init();
    }

    injectScript(file, node) {
        const th = document.getElementsByTagName(node)[0];
        const s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        s.onload = function () {
            this.parentNode.removeChild(this)
        }
        th.appendChild(s);
    }

    initContainer() {
        const { document } = window;
        const base = document.querySelector(`#${WRAPPER_CLASS_NAME}`);
        if (base) {
            this.container = base;
        } else {
            this.container = document.createElement('div');
            this.container.setAttribute('id', WRAPPER_CLASS_NAME);
            this.container.setAttribute('class', WRAPPER_CLASS_NAME);
            this.container.setAttribute('style', 'display: none');
            document.body.appendChild(this.container);
        }
    }
    init() {
        this.initContainer()
        setTimeout(() => {
            this.injectScript(
                chrome.runtime.getURL('contentProxy.bundle.js'),
                'body'
            );
        }, 0)
    }
}
