document.getElementById("youtubeLink").addEventListener("input", function() {
    var youtubeLink = document.getElementById("youtubeLink").value.trim();
    var isDisabled = youtubeLink === "";
    ["getTranscriptButton", "getPDFButton", "getVIDButton", "getAIButton"].forEach(id => {
        document.getElementById(id).disabled = isDisabled;
    });
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
    fetchTranscript(youtubeLink)
        .then(data => {
            var transcript = data.transcripts[0].text;
            document.getElementById("transcript").innerText = transcript;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error retrieving transcript. Reasons could be the language is not in English, incorrect video ID, or API issues.");
        });
}

function getPDF() {
    var youtubeLink = document.getElementById("youtubeLink").value;
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

            doc.save('transcript.pdf');
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error retrieving transcript");
        });
}


// Client-side JavaScript
function getVID() {
    var URLInput = document.getElementById("youtubeLink").value;
    sendURL(URLInput); // Call sendURL with the input value directly, without calling .value again
}

function sendURL(URL) {
    window.location.href = `https://youtube-transcript-8nb1.onrender.com/download?URL=${encodeURIComponent(URL)}`; // Encode the URL before sending it to the server
}


function getAI() {
    var youtubeLink = document.getElementById("youtubeLink").value;
    fetchTranscript(youtubeLink)
        .then(data => {
            var transcript = data.transcripts[0].text;
            // Send transcript to the server
            return fetch('/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transcript: transcript })
            });
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(summary => {
            document.getElementById("transcript").innerText = JSON.stringify(summary);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            displayError("Error summarizing transcript");
        });
}
