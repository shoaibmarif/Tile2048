// Manifest V3 Background Service Worker for 2048 Game

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  chrome.contextMenus.create({
    id: 'open-2048-game',
    title: 'Play 2048 Game Online',
    contexts: ['action', 'page'],
  });

  chrome.contextMenus.create({
    id: 'open-2048-rules',
    title: '2048 Strategy Guide & AI Solver',
    contexts: ['action'],
  });

  console.log('2048 Game extension successfully installed.');
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'open-2048-game') {
    chrome.tabs.create({ url: 'https://2048classic.netlify.app/' });
  } else if (info.menuItemId === 'open-2048-rules') {
    chrome.tabs.create({ url: 'https://2048classic.netlify.app/#how-to-play' });
  }
});

// Listener for runtime messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_VERSION') {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }
  return true;
});
