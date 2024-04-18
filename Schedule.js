function copyTextToTelegram() {
  var token = "7191939557:AAEas0aAMV5m09NeoHIDKmXV8MHrrl5ENMo"; // Replace with your Telegram bot token
  //var chatId = "-1001695668649"; //Ops General (Live)
  //var chatId = "-1001948361484"; //Magic// Replace with your group chat ID
  var chatId = "-1002047806420"; // Burn Test
  //var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/10D70GGv8zWl3ulT_7tsGBXszXLT2wS_wD_JsAYfb84k/";
  var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/19LOChYh93yN2zhyoxv4L54w9AxyAJTGDAh-HRIAtb-w/";
  var sheetName = "Daily"; // Replace with your sheet name
  
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  var data = sheet.getDataRange().getValues();
  
  // Construct message with all data
  /*var message = "Data from Google Sheets:\n";
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      message += data[i][j] + "\t";
    }
    message += "\n";
  }*/

  var rawDate = sheet.getRange("B1").getValue();
  var scheduleDate = Utilities.formatDate(rawDate, Session.getScriptTimeZone(), "dd/MM/yyyy");
  
  // Get all data starting from the second row
  //var data = sheet.getRange("A2:B" + sheet.getLastRow()).getValues();
  var dataAB = sheet.getRange("A2:B" + sheet.getLastRow()).getValues();
  var dataDE = sheet.getRange("D2:E" + sheet.getLastRow()).getValues();

  
  // Construct message with formatted data including schedule date
  var message = "Schedule for " + scheduleDate + ":\n";

  for (var i = 0; i < dataAB.length; i++) {
    if (dataAB[i][0] !== "") { // Check if the name in column A is not empty
      if (dataAB[i][1] !== "") {
        message += dataAB[i][0] + " : " + dataAB[i][1] + "\n"; // Concatenate name and availability with a colon (:)
      } else {
        message += dataAB[i][0] + "\n"; // If column B is empty, do not include colon
      }
    } else {
      // Add a space if the next row has data
      if (i < dataAB.length - 1 && dataAB[i + 1][0] !== "") {
        message += "\n";
      }
    }
  };

  message += "\nOff Hour Developer:\n";

  for (var i = 0; i < dataDE.length; i++) {
    if (dataDE[i][0] !== "") { // Check if the name in column A is not empty
      if (dataDE[i][1] !== "") {
        message += dataDE[i][0] + " : " + dataDE[i][1] + "\n"; // Concatenate name and availability with a colon (:)
      } else {
        message += dataDE[i][0] + "\n"; // If column B is empty, do not include colon
      }
    } else {
      // Add a space if the next row has data
      if (i < dataDE.length - 1 && dataDE[i + 1][0] !== "") {
        message += "\n";
      }
    }
  }

  // Send text to Telegram
  sendTelegramMessage(token, chatId, message);
}

function sendTelegramMessage(token, chatId, text) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  var payload = {
    "method": "POST",
    "contentType": "application/json",
    "payload": JSON.stringify({
      "chat_id": chatId,
      "text": text
    }),
    "muteHttpExceptions": true
  };
  
  var response = UrlFetchApp.fetch(url, payload);
  Logger.log(response.getContentText()); // Log response for debugging
}
