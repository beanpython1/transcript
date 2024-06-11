function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
document.getElementById("youtubeLink").addEventListener("input", function() {
    var youtubeLink = document.getElementById("youtubeLink").value.trim();
    var isDisabled = youtubeLink === "";
    ["getTranscriptButton", "getPDFButton", "getVIDButton", "getAIButton", "copyButton", "getMP3Button"].forEach(id => {
        document.getElementById(id).disabled = isDisabled;
    });
});
document.getElementById("copyButton").addEventListener("click", function() {
    var transcriptElement = document.getElementById("transcript");
    var textToCopy = transcriptElement.innerText;

    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");

    document.body.removeChild(tempTextArea);

    alert("Copied the transcript/summary to clipboard!");
});

function fetchTranscript(youtubeLink) {
    var videoID = youtubeLink.split('v=')[1];
    if (!videoID) throw new Error('Invalid YouTube link');
    var apiUrl = 'https://youtube-transcriber-api.vercel.app/v1/transcripts?id=' + videoID + '&lang=en';
    return fetch(apiUrl).then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    });
}

function displayError(message) {
    document.getElementById("transcript").innerText = message;
}

function getTranscript() {
    var youtubeLink = document.getElementById("youtubeLink").value;
    showLoader();
    fetchTranscript(youtubeLink)
        .then(data => {
            var transcript = data.transcripts[0].text;
            document.getElementById("transcript").innerText = transcript;
            hideLoader();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error retrieving transcript. Reasons could be the language is not in English, incorrect video ID, or API issues.");
            hideLoader();
        });
}

function getPDF() {
    var youtubeLink = document.getElementById("youtubeLink").value;
    showLoader();
    fetchTranscript(youtubeLink)
        .then(data => {
            var transcript = data.transcripts[0].text;
            document.getElementById("transcript").innerText = transcript;

            const { jsPDF } = window.jspdf;
            var doc = new jsPDF();
            var pageHeight = doc.internal.pageSize.height;
            var margin = 10;
            var maxLineWidth = 180;
            var lineHeight = 10;
            var y = margin;

            var lines = doc.splitTextToSize(transcript, maxLineWidth);
            lines.forEach(line => {
                if (y + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += lineHeight;
            });
            hideLoader();
            doc.save('transcript.pdf');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error retrieving transcript");
            hideLoader();
        });
}


// Client-side JavaScript
function getVID() {
    var URLInput = document.getElementById("youtubeLink").value;
    sendURL(URLInput); // Call sendURL with the input value directly, without calling .value again
}

function getMP3() {
    var URLInput = document.getElementById("youtubeLink").value;
    sendMP3(URLInput); // Call sendMP3 with the input value directly, without calling .value again
}

function sendMP3(URL) {
    window.location.href = `https://transcript-r2z3.onrender.com/downloadmp3?URL=${encodeURIComponent(URL)}`;
    hideLoader(); // Encode the URL before sending it to the server
}

function sendURL(URL) {
    window.location.href = `https://transcript-r2z3.onrender.com/download?URL=${encodeURIComponent(URL)}`; // Encode the URL before sending it to the server
    hideLoader();
}



function getAI() {
    var youtubeLink = document.getElementById("youtubeLink").value;
    showLoader();
    fetchTranscript(youtubeLink)
        .then(data => {
            var transcript = data.transcripts[0].text;
            var cleanedTranscript = transcript.replace(/\[\s*__\s*\]/g, ''); // Remove [ __ ]
            var isTrimmed = cleanedTranscript.length > 5100;
            var trimmedTranscript = isTrimmed ? cleanedTranscript.slice(0, 5100) : cleanedTranscript;
            console.log(trimmedTranscript)

            return fetch('https://transcript-r2z3.onrender.com/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transcript: trimmedTranscript })
            }).then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
                hideLoader();
            }).then(summary => {
                var summaryText = isTrimmed ? summary.summary + ' (Only summarised first 5100 characters)' : summary.summary;
                document.getElementById("transcript").innerText = summaryText;
                hideLoader();
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error summarizing transcript");
            hideLoader();
        });
}


function getAIText() {
    var userPrompt = prompt("Enter AI Prompt: ");
    showLoader();

    if (userPrompt) {
        fetch('https://transcript-r2z3.onrender.com/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userPrompt })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
            hideLoader();
        })
        .then(data => {
            var reply = data.reply; // Assuming the server response has a 'reply' field
            document.getElementById("transcript").innerText = reply;
            hideLoader();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error processing AI prompt");
            hideLoader();
        });
    }
}
