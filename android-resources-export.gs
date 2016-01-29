// Export resources function
function exportResources() {
  
  var name = "Weather Line";
  
  var appFolder = createOrGetFolder(name);
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var i = 2;
  while (data[1][i].length > 0) {
    
    var results = data[1][i].match(/\((\w\w)\)/g);
    if (results.length > 0) {
      var language = results[0].replace("(", "").replace(")", "");
      var folderName = "values-" + language;
      var languageFolder = createOrGetFolder(folderName, appFolder);
      createXMLForLanguage(sheet, data, languageFolder, i);
    }
    
    i++;
  }
  
}

// Create a language XML file
function createXMLForLanguage(sheet, data, folder, column) {
  
  var content = "<resources>";
  content += "\n\n";
  content += "<!-- App name -->";
  content += '\n<string name="app_name">Weather Line</string>';
  
  for (var i = 3; i < data.length; i++) {
    
    if (data[i][1].length == 0) {
      continue;
    }
    
    if (data[i][0].length > 0) {
      content += "\n\n<!-- " + data[i][0] + " -->";
    }
    
    var formatted = "";
    if (data[i][2].indexOf("%s") > -1) {
        formatted = ' formatted="false"';
    }
    
    content += '\n<string name="' + data[i][1] + '"' + formatted + '>' + data[i][column] + '</string>';
  }
  
  content += "\n\n</resources>";
  
  var file = createOrGetFile("strings.xml", folder);
  file.setContent(content);
}


// Check folder
function createOrGetFolder(name, folder) {
  var folders;
  if (folder == undefined) {
    folders = DriveApp.getFoldersByName(name)
  } else {
    folders = folder.getFoldersByName(name)
  }
  
  var mainFolder;
  if (folders.hasNext()) {
    mainFolder = folders.next();
  } else {
     if (folder == undefined) {
       mainFolder = DriveApp.createFolder(name);
     } else {
       mainFolder = folder.createFolder(name);
     }
  } 
  
  return mainFolder;
}


// Check file
function createOrGetFile(name, folder) {
  var files;
  if (folder == undefined) {
    files = DriveApp.getFilesByName(name)(name)
  } else {
    files = folder.getFilesByName(name)
  }
  
  var file;
  if (files.hasNext()) {
    file = files.next();
  } else {
     if (folder == undefined) {
       file = DriveApp.createFile(name, "");
     } else {
       file = folder.createFile(name, "");
     }
  } 
  
  return file;
}