'use strict';

var API_KEY = window.GoogleSamples.Config.gcmAPIKey;
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';
var FIREFOX_ENDPOINT = 'https://updates.push.services.mozilla.com/push';

var ENABLE_MESSAGE = '通知を有効にする';
var DISABLE_MESSAGE = '通知を無効にする';
var UNSUPPORTED_BROWSER_MESSAGE = 'このブラウザは対応していません';
var SEND_OK_MESSAGE = 'メッセージの送信に成功しました';
var SEND_NG_MESSAGE = 'メッセージの送信に失敗しました レスポンスコード：';

var curlCommandDiv = document.querySelector('.js-curl-command');
var isPushEnabled = false;

var mergedEndpoint = '';

// This method handles the removal of subscriptionId
// in Chrome 44 by concatenating the subscription Id
// to the subscription endpoint
function endpointWorkaround(pushSubscription) {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf(GCM_ENDPOINT) !== 0) {
    return pushSubscription.endpoint;
  }

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }
  return mergedEndpoint;
}

function sendSubscriptionToServer(subscription) {
  // TODO: Send the subscription.endpoint
  // to your server and save it to send a
  // push message at a later date
  //
  // For compatibly of Chrome 43, get the endpoint via
  // endpointWorkaround(subscription)
  console.log('TODO: Implement sendSubscriptionToServer()');

  mergedEndpoint = endpointWorkaround(subscription);

  // This is just for demo purposes / an easy to test by
  // generating the appropriate cURL command
  showCurlCommand(mergedEndpoint);
}

// NOTE: This code is only suitable for GCM endpoints,
// When another browser has a working version, alter
// this to send a PUSH request directly to the endpoint
function showCurlCommand(mergedEndpoint) {
  // The curl command to trigger a push message straight from GCM
  if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0 && mergedEndpoint.indexOf(FIREFOX_ENDPOINT) !== 0) {
    window.Demo.debug.log(UNSUPPORTED_BROWSER_MESSAGE);
    return;
  }

  var curlCommand = '';

  // Chrome
  if (mergedEndpoint.indexOf(GCM_ENDPOINT) === 0) {
    var endpointSections = mergedEndpoint.split('/');
    var subscriptionId = endpointSections[endpointSections.length - 1];

    curlCommand = 'curl --header "Authorization: key=' + API_KEY +
      '" --header Content-Type:"application/json" ' + GCM_ENDPOINT +
      ' -d "{\\"registration_ids\\":[\\"' + subscriptionId + '\\"]}"';
  } else if (mergedEndpoint.indexOf(FIREFOX_ENDPOINT) === 0) { // Firefox
    curlCommand = 'curl "' + mergedEndpoint + '" -d ""';
  }

  curlCommandDiv.textContent = curlCommand;
}

function sendMessage() {
  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];
  var browser = '';

  if (mergedEndpoint.indexOf(GCM_ENDPOINT) === 0) {
    browser = 'chrome';
  } else if (mergedEndpoint.indexOf(FIREFOX_ENDPOINT) === 0) {
    browser = 'firefox';
  }

  if (browser !== '') {
    fetch('/api', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'endpoint': subscriptionId,
        'browser': browser
      })
    }).then(function(response) {
      if (response.ok) {
        window.Demo.debug.log(SEND_OK_MESSAGE);
      } else {
        window.Demo.debug.log(SEND_NG_MESSAGE + response.status);
      }
    });
  }
}

function unsubscribe() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;
  curlCommandDiv.textContent = '';

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (!pushSubscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          isPushEnabled = false;
          pushButton.disabled = false;
          pushButton.textContent = ENABLE_MESSAGE;
          return;
        }

        // TODO: Make a request to your server to remove
        // the users data from your data store so you
        // don't attempt to send them push messages anymore

        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function() {
          pushButton.disabled = false;
          pushButton.textContent = ENABLE_MESSAGE;
          isPushEnabled = false;
        }).catch(function(e) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the subscription id from your data store and
          // inform the user that you disabled push

          window.Demo.debug.log('通知解除エラー', e);
          pushButton.disabled = false;
        });
      }).catch(function(e) {
        window.Demo.debug.log('通知解除時にエラーが発生しました', e);
      });
  });
}

function subscribe() {
  // Disable the button so it can't be changed while
  // we process the permission request
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        // The subscription was successful
        isPushEnabled = true;
        pushButton.textContent = DISABLE_MESSAGE;
        pushButton.disabled = false;

        // TODO: Send the subscription subscription.endpoint
        // to your server and save it to send a push message
        // at a later date
        return sendSubscriptionToServer(subscription);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          window.Demo.debug.log('通知設定ができませんでした');
          pushButton.disabled = true;
        } else {
          // A problem occurred with the subscription, this can
          // often be down to an issue or lack of the gcm_sender_id
          // and / or gcm_user_visible_only
          window.Demo.debug.log('プッシュ機能を有効にできませんでした.', e);
          pushButton.disabled = false;
          pushButton.textContent = ENABLE_MESSAGE;
        }
      });
  });
}

// Once the service worker is registered set the initial state
function initialiseState() {
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    window.Demo.debug.log('通知機能がサポートされていません');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    window.Demo.debug.log('ユーザが通知機能をブロックしました');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    window.Demo.debug.log('プッシュ機能がサポートされていません');
    return;
  }

  // We need the service worker registration to check for a subscription
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // Do we already have a push message subscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
        // Enable any UI which subscribes / unsubscribes from
        // push messages.
        var pushButton = document.querySelector('.js-push-button');
        pushButton.disabled = false;

        if (!subscription) {
          // We aren’t subscribed to push, so set UI
          // to allow the user to enable push
          return;
        }

        // Keep your server in sync with the latest subscription
        sendSubscriptionToServer(subscription);

        // Set your UI to show they have subscribed for
        // push messages
        pushButton.textContent = DISABLE_MESSAGE;
        isPushEnabled = true;
      })
      .catch(function(err) {
        window.Demo.debug.log('登録中にエラーが発生しました', err);
      });
  });
}

window.addEventListener('load', function() {
  var pushButton = document.querySelector('.js-push-button');
  var sendButton = document.querySelector('.js-send-button');
  pushButton.addEventListener('click', function() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

  sendButton.addEventListener('click', function() {
    sendMessage();
  });

  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
    .then(initialiseState);
  } else {
    window.Demo.debug.log(UNSUPPORTED_BROWSER_MESSAGE);
  }
});
