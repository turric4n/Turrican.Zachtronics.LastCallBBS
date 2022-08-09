let lastKey;
let keyBuffer;
let authenticated = false;
let authenticatedInfo = {
    lastLogged: new Date()
}
let passWord = "turrican";
let lastCommand = "";

function getAuthenticationStatusColor() {
    return authenticationStatusColor = authenticated ? 17 : 8;
}

function getName() {
    return "Turrican's Server";
}

function onConnect() {
    // Reset the server variables when a new user connects:
    lastKey = '';
    serverData = loadData();
    keyBuffer = '';

    if (serverData) {
        var serverDataJson = JSON.parse(serverData);
        if (serverDataJson && serverDataJson.lastLogged) {
            authenticatedInfo.lastLogged = serverDataJson.lastLogged;
        }
    } 
    else {
        authenticatedInfo.lastLogged = "Never";
    }    
}

function authenticate(pass) {    
    lastCommand = "AUTH";
    authenticated = (pass == passWord);  
    if (authenticated) {
        authenticatedInfo.lastLogged = new Date().toString();
        var dataJson = JSON.stringify(authenticatedInfo);
        saveData(dataJson);
    }     
}

function drawAuthenticationScreen() {
    drawText(lastCommand == "AUTH" ? "Invalid Password!" : "Please authenticate", 17, 2, 2);
    drawText(keyBuffer.toString(), 17, 4, 3);
}

function onUpdate() {
    clearScreen();
    drawText("Welcome to " + getName(), 17, 0, 0);
    drawText("Last login on : " + authenticatedInfo.lastLogged.toString(), 17, 1, 1);
    drawText("Your current status is " + (authenticated ? "Logged In" : "Not logged"), getAuthenticationStatusColor(), 2, 2);
    
    if (!authenticated) {
       return drawAuthenticationScreen();
    }        
}

function onInput(key) {
    // Remember the last key pressed:
    lastKey = key.toString();

    // Update the persisted text field:
    if (key == 8 && keyBuffer.length > 0) {
        keyBuffer = keyBuffer.substring(0, keyBuffer.length - 1);
    }
    else if (key >= 32 && key < 127 && keyBuffer.length < 49) {
        keyBuffer = keyBuffer + String.fromCharCode(key);
    }

    if (!authenticated) {        
        if (key === 9) {            
            authenticate(keyBuffer);
            keyBuffer = "";
        }        
    }
}