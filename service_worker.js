// Add the context menu option
const API_KEY = 'AIzaSyDCHKQJagkrXh8tfIUhxa_77c7wPxGWf'
const SEARCH_ENGINE_ID = 'f27a58470088040c4'

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      id: "steamSearch",
      title: "Open the store page of %s on Steam",
      contexts: ["selection"],
    });
    chrome.contextMenus.create({
      id: "steamSearchV2",
      title: "Use Steam Search to search for '%s'",
      contexts: ["selection"],
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === "steamSearchV2" && info.selectionText) {
      const searchTerm = encodeURIComponent(info.selectionText);
      const steamSearchURL = `https://store.steampowered.com/search/?term=${searchTerm}`;
      chrome.tabs.create({ url: steamSearchURL });
    }
    else if (info.menuItemId === "steamSearch" && info.selectionText) {
      var searchTerm = info.selectionText + " on Steam";
      // Fetch the search results
      fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchTerm)}&key=${API_KEY}-8&cx=${SEARCH_ENGINE_ID}`)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          data.items.some(item => {
            const item_link = item.link;
            if (item_link.startsWith("https://store.steampowered.com/")){
              chrome.tabs.create({url: item_link});
              return true;
            }
            return false;
          })
        }
      })
    }
  });
