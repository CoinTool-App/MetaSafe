class PostMessageClient {
    listenDecision() {
        return new Promise((resolve) => {
            window.addEventListener('message', (e) => {
                if (e.origin !== window.location.origin) {
                    return;
                }
                if (typeof e.data.msg_key === 'undefined') {
                    return;
                }
                if (e.data.msg_key !== 'user_decision') {
                    return;
                }
                resolve(e.data);
            });
        });
    }

    listenChangeLang() {
        return new Promise((resolve) => {
            window.addEventListener('message', (e) => {
                if (e.origin !== window.location.origin) {
                    return;
                }
                if (typeof e.data.msg === 'undefined') {
                    return;
                }
                if (!e.data.msg.includes('changeLang')) {
                    return;
                }
                resolve(e.data);
            });
        });
    }

    postMsg(message) {
        const targetOrigin = window.location.origin;
        const msg = JSON.parse(JSON.stringify(message));
        window.postMessage(msg, targetOrigin);
    }
}

const postMessageClient = new PostMessageClient();

export {
    postMessageClient
};
