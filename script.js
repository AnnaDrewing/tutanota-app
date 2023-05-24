let input = document.querySelector("#url");

// Validating occurs as the user is typing
input.addEventListener("input", validateInput);

// Existence check occurs when the user clicks away
input.addEventListener("input", throttle(runExistenceCheck, 3000));

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

/**
 * Checks whether the given URL is of valid format.
 * According to MDN docs: "A single properly-formed absolute URL. This doesn't necessarily mean the URL address exists, but it is at least formatted correctly. In simple terms, this means urlscheme://restofurl"
 */
function validateInput() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    hideAllHints();
    // I have spent a long time looking and trying out various URL-Validation regular expressions for JS
    //but since none of them really do the job hundred percent well, I thought I may as well use the simple built-in validation
    let inputIsValid = input.value && input.checkValidity();
    if (!inputIsValid) {
      let hint = document.getElementById("hint");
      showHint(hint);
    }
  };
  let url = input.value;
  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
 * Checks whether the given URL leads to a file or a folder
 */
function runExistenceCheck() {
  console.log("Running existence check!");
  var xhttp = new XMLHttpRequest();
  let url = input.value;
  xhttp.onreadystatechange = function () {
    // Source of the regular expression: https://stackoverflow.com/questions/57960849/regex-to-match-a-url-with-no-file-extension
    const folderRegex = new RegExp(/(?:\/|^)[^.\/]+$/);
    let inputIsValid = input.value && input.checkValidity();
    // Running the existence check only if input is valid
    if (inputIsValid) {
      hideAllHints();
      if (folderRegex.test(input.value)) {
        let folderInfo = document.getElementById("folder");
        showHint(folderInfo);
      } else {
        let fileInfo = document.getElementById("file");
        showHint(fileInfo);
      }
    }
  };
  console.log(url);
  xhttp.open("GET", url, true);
  xhttp.send();
}

function showHint(hint) {
  hint.style.display = "block";
}

function hideAllHints() {
  let folderInfo = document.getElementById("folder");
  folderInfo.style.display = "none";
  let fileInfo = document.getElementById("file");
  fileInfo.style.display = "none";
  let hint = document.getElementById("hint");
  hint.style.display = "none";
}
