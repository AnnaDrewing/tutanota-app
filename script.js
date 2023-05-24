let input = document.querySelector("#url");
let form = document.querySelector("form");

// Validating occurs as the user is typing
input.addEventListener("input", validateInput);

// Existence check occurs when the user clicks away
input.addEventListener("change", runExistenceCheck);

/**
 * Checks whether the given URL is of valid format.
 * According to MDN docs: "A single properly-formed absolute URL. This doesn't necessarily mean the URL address exists, but it is at least formatted correctly. In simple terms, this means urlscheme://restofurl"
 */
function validateInput() {
  console.log("Validating input!");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    let hint = document.getElementById("hint");
    // I have spent a long time looking and trying out various URL-Validation regular expressions for JS
    //but since none of them really do the job hundred percent well, I thought I may as well use the simple built-in validation
    let inputIsValid = input && input.checkValidity();
    if (!inputIsValid) {
      hint.style.display = "block";
    } else {
      hint.style.display = "none";
    }
  };
  xhttp.open("GET", "http://localhost:3000/", true);
  xhttp.send();
}

/**
 * Checks whether the given URL leads to a file or a folder
 */
function runExistenceCheck() {
  console.log("Existence check triggered!");
  // Source of the regular expression: https://stackoverflow.com/questions/57960849/regex-to-match-a-url-with-no-file-extension
  const folderRegex = new RegExp(/(?:\/|^)[^.\/]+$/);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    let folderInfo = document.getElementById("folder");
    let fileInfo = document.getElementById("file");
    let inputIsValid = input && input.checkValidity();
    // Running the existence check only if input is valid
    if (inputIsValid) {
      if (folderRegex.test(input.value)) {
        fileInfo.style.display = "none";
        folderInfo.style.display = "block";
      } else {
        folderInfo.style.display = "none";
        fileInfo.style.display = "block";
      }
    } else {
      fileInfo.style.display = "none";
      folderInfo.style.display = "none";
    }
  };
  xhttp.open("GET", "http://localhost:3000/", true);
  xhttp.send();
}
