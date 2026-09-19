// Manifest V3 Background Service Worker for Tile 2048

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu items
  chrome.contextMenus.create({
    id: 'open-2048-game',
    title: 'Play Tile 2048 Online',
    contexts: ['action', 'page'],
  });

  chrome.contextMenus.create({
    id: 'open-2048-rules',
    title: 'Tile 2048 Strategy Guide & AI Solver',
    contexts: ['action'],
  });

  console.log('Tile 2048 extension successfully installed.');
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'open-2048-game') {
    chrome.tabs.create({ url: 'https://tile2048.netlify.app/' });
  } else if (info.menuItemId === 'open-2048-rules') {
    chrome.tabs.create({ url: 'https://tile2048.netlify.app/#how-to-play' });
  }
});

// Listener for runtime messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_VERSION') {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }
  return true;
});
