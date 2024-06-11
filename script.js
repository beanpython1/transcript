body {
    background-image: url('background.jpg');
    background-size: cover;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

h1 {
    color: red;
    font-size: 2em;
}

#transcript {
    margin-top: 60px;
    padding: 20px;
    border: 2px solid red;
    background-color: #f1f1f1;
    border-radius: 15px;
    color: #333;
    width: 80%;
    max-width: 800px;
    min-height: 350px;
    max-height: 450px;
    overflow-y: auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    margin-left: auto;
    margin-right: auto;
}

input[type="text"] {
    margin: 10px;
    padding: 5px;
    background-color: red;
    border: 2px white dotted;
    border-radius: 5px;
    color: white;
}

::placeholder {
    color: white;
}

button {
    margin-top: 10px;
    background-color: red;
    padding: 5px 10px;
    color: white;
    border-radius: 15px;
    border: 1px black solid;
    font-size: 1em;
}

button:hover {
    cursor: pointer;
}

button:disabled {
    cursor: default;
    background-color: #666;
    color: #ccc;
}

#getAI {
    position: fixed;
    left: 50%;
    bottom: -8em;
    transform: translateX(-50%);
    z-index: 9999;
}
