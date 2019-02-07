const serverAddress = 'https://recr.ittalent.ee';
var openCandidateButton = document.getElementById('open-candidate');
var response = document.getElementById('response');
var candidateName = document.getElementById('name');
var userName = document.getElementById('owner-name');
var created = document.getElementById('created');
var updated = document.getElementById('updated');
var link = '';

function getLinkForTheCandidate()  {
  chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
    link = tab[0].url;
  });
}

openCandidateButton.onclick = function(){
  var xhr = new XMLHttpRequest();
  getLinkForTheCandidate();
  var address = serverAddress + '/linkedin.json?query=' + link;
  console.log(address);
  xhr.open("GET", address, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log(xhr.responseText);
      var resp = JSON.parse(xhr.responseText);
      if (resp['errors']) {
        response.innerHTML = "No such candidate in DB";
      } else {
        candidateName.innerHTML = resp['name'];
        userName.innerHTML = "Candidate owner: " + resp['owner'];
        created.innerHTML = "Created at: " + resp['created_at'].split("T")[0];
        updated.innerHTML = "Last updated: " + resp['updated_at'].split("T")[0];
      }
    } else if (xhr.status == 401) {
      window.open(serverAddress, '_blank');
    } else {
      response.innerHTML = "Connection error";
    }
  }
  xhr.send();
}

