let input = document.querySelector("#url");

// Validating occurs as the user is typing
input.addEventListener("input", validateInput);

// Existence check occurs when the user clicks away
input.addEventListener("input", throttle(runExistenceCheck, 1000));

// Source: https://stackoverflow.com/questions/7082527/jquery-throttling-and-queuing-of-ajax-requests
function throttle(func, wait) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    if (!timeout) {
      // the first time the event fires, we setup a timer, which
      // is used as a guard to block subsequent calls; once the
      // timer's handler fires, we reset it and create a new one
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

function showHint(hint) {
  hint.style.display = "block";
}

function hideAllHints() {
  const hints = document.querySelectorAll(".hint");
  [...hints].forEach((hint) => (hint.style.display = "none"));
}
/**
 * Checks whether the given URL is of valid format.
 * According to MDN docs: "A single properly-formed absolute URL. This doesn't necessarily mean the URL address exists, but it is at least formatted correctly. In simple terms, this means urlscheme://restofurl"
 */
function validateInput() {
  hideAllHints();
  let inputIsValid = input.value && input.checkValidity();
  if (!inputIsValid) {
    let urlHint = document.getElementById("url-hint");
    showHint(urlHint);
  }
}

/**
 * Checks whether the given URL leads to a file or a folder
 */
async function runExistenceCheck() {
  let url = input.value;
  // Source of the regular expression: https://stackoverflow.com/questions/57960849/regex-to-match-a-url-with-no-file-extension
  const folderRegex = new RegExp(/(?:\/|^)[^.\/]+$/);
  let inputIsValid = input.value && input.checkValidity();
  // Running the existence check only if input is valid
  if (inputIsValid) {
    hideAllHints();
    const serverCallResult = await mockServerResponse(url);
    // Check if folder or file
    if (serverCallResult === 200) {
      console.log("Your server call was successful! Rejoice!");
      if (folderRegex.test(input.value)) {
        let folderInfo = document.getElementById("folder");
        showHint(folderInfo);
      } else {
        let fileInfo = document.getElementById("file");
        showHint(fileInfo);
      }
    } else {
      let serverNope = document.getElementById("server");
      showHint(serverNope);
    }
  }
}

function mockServerResponse(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //Randomly resolve or reject
      const randomNum = Math.floor(Math.random() * 10);
      if (randomNum < 5) {
        resolve(200); //Status code for successful server response
      } else {
        reject(502); //Status code for "Bad Gateway"
      }
    }, 1000);
  }).catch((err) => {
    console.log("We got a server error: " + err);
  });
}
