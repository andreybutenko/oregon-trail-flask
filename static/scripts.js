const ACTIONS = ['travel', 'rest', 'hunt', 'status', 'help'];
const TIMEOUT = 1000;
const TOTAL_DISTANCE = 2000;

/** Call the Python backend to get current stats */
function updateStats() {
  removeAllChildren('stats');
  appendContent('stats', 'Loading stats...');

  fetch('/stats', {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
  })
    .then(response => response.json())
    .then(data => {
      removeAllChildren('stats');
      Object.keys(data).forEach(key => {
        appendContent('stats', `${key}: ${data[key]}`);
      });
      setProgress(data.distance);
    })
    .catch(err => {
      console.error(err);
      removeAllChildren('stats');
      appendContent('stats', 'There was likely an error in your Python code. Please check for error messages in the Repl console.', 'error');
    });
}

/** Call the Python backend with a given action */
function callAction(action) {
  timeoutActions();
  fetch('/action', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
  })
    .then(response => response.json())
    .then(data => {
      updateStats();
      data.results.forEach(message => appendOutput(message));
    })
    .catch(err => {
      console.error(err);
      displayError('There was likely an error in your Python code. Please check for error messages in the Repl console and Browser console.');
    });
}

/** Set progress bar */
function setProgress(distance) {
  document.getElementById('progress').style = `width: ${distance / TOTAL_DISTANCE * 100}%`;
}

/** Add a message to the output section */
function appendOutput(message) {
  appendContent('output', message);
}

/** Add an error to the output section */
function displayError(message) {
  appendContent('output', message, 'error');
}

/** Adds a <span> with the given text and class to the given parent element */
function appendContent(parentId, contentText, contentClass) {
  const parent = document.getElementById(parentId);
  const newSpan = document.createElement('span');
  newSpan.innerText = contentText;
  newSpan.classList.add(contentClass);
  parent.appendChild(newSpan);

  if (parentId === 'output') {
    parent.scrollTop = parent.scrollHeight;
  }
}

/** Removes all children from a given element */
function removeAllChildren(elementId) {
  const element = document.getElementById(elementId);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/** Sets all the actions button to be disabled for a brief time */
function timeoutActions() {
  setActionsDisabled(true);
  setTimeout(() => setActionsDisabled(false), TIMEOUT);
}

/** Sets all the actions button to be enabled or disabled */
function setActionsDisabled(isDisabled) {
  ACTIONS.map(action => document.getElementById(action)).forEach(btn => btn.disabled = isDisabled);
}

/** Set up button onClick listeners */
function setupListeners() {
  ACTIONS.forEach(action => document.getElementById(action).addEventListener('click', () => callAction(action)))
}

document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  setupListeners();
});
