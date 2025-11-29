// TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://hamzadorbane33-sys.github.io/Lockgram/tonconnect-manifest.json',
  actionsConfiguration: {
    modals: 'all',
    notifications: 'all',
  }
});

// Zero-backend signup
document.getElementById('connectWallet').onclick = async () => {
  await tonConnectUI.connect();
  const account = tonConnectUI.account;
  if (account) {
    localStorage.setItem('lockgram_user', JSON.stringify({wallet:account.address}));
    showInvite();
  }
};

function showInvite() {
  document.getElementById('invite').style.display = 'block';
  const wallet = JSON.parse(localStorage.getItem('lockgram_user')).wallet;
  const invite = `https://t.me/Lockgramapp_bot/LockGram?startapp=${wallet}`;
  document.getElementById('inviteLink').value = invite;
}

function copyInvite() {
  navigator.clipboard.writeText(document.getElementById('inviteLink').value);
  alert('Link copied!');
}

function shareTwitter() {
  const text = encodeURIComponent('Join me on LockGram – earn crypto for chatting! 🔒💰');
  const url = encodeURIComponent(document.getElementById('inviteLink').value);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`,'_blank');
}

function shareTelegram() {
  const text = encodeURIComponent('Join me on LockGram – earn crypto for chatting! 🔒💰');
  const url = encodeURIComponent(document.getElementById('inviteLink').value);
  window.open(`https://t.me/share/url?url=${url}&text=${text}`,'_blank');
}
