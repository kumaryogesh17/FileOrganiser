let fs = require("fs");
let path = require("path");

// taking directory path from console which has to be organised..
const sourcePath = process.argv.splice(2);


// these are types of files 
let FileTypes = {
    media: ["mp4", "mkv","m4v"],
    audio: ["aac","mp3","wav","wma","dts"],
    photos:["png","jpg","jpeg","gif","bmp"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}


// main function of organise file

function FileOrganiser(sourcePath) {

// FileOrganiser will check if there is correct path is given or not , if not then simple return.

    let destPath;
    if (sourcePath == undefined) {
        destPath = process.cwd();
        return;
    } 
    else {

        let doesExist = fs.existsSync(sourcePath);
        if (doesExist) {

            // organized folder doesnot exist then it will create a new folder , otherwise not.
            destPath = path.join(sourcePath, "File Organiser");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }

        } else {
            console.log("Kindly enter the correct path");
            return;
        }
    }
    // this function will check the total number of file and their category of file.
    organizeHelper(sourcePath, destPath);
    
}

function organizeHelper(src,dest){
  // getting childname from the source path
   const fileNames = fs.readdirSync(src);
  
   console.log(fileNames);
   
   for(let i=0; i<fileNames.length; i++){
        let fileAddress = path.join(src,fileNames[i]);
        
        // checking if this is a file or not
        let isFile = fs.lstatSync(fileAddress).isFile();

        if(isFile){
            // if it is a file then , checking their file category using categoryOfFiles function.
            let category = categoryofFiles(fileNames[i]);

            console.log(fileNames[i], " belongs to this category --> ", category);

            // This function will move file from the source path to the destination path.
            moveFiles(fileAddress, dest, category);
        }
   }
}

function moveFiles(fileAddress, dest, category) {
    
    // getting file path of different categories
    let categoryPath = path.join(dest, category);

    // if their folders exits then move next , otherwise create a new folder of that category.
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    // getting file name here.
    let fileName = path.basename(fileAddress);

    // the destFilePAth is the final destination path , the path where file will be moved
    let destFilePath = path.join(categoryPath, fileName);

    // here we are copying file from the source path to destination path.
    //  we can also delete file using an unlinksync function
    fs.copyFileSync(fileAddress, destFilePath);

    // fs.unlinkSync(fileAddress);

    console.log(fileName, "copied to ", category);

}

// function for getting types of file 
function categoryofFiles(fileName) {
    let ext = path.extname(fileName);
    ext = ext.slice(1);
    for (let type in FileTypes) {
        let TypeArray = FileTypes[type];
        for (let i = 0; i < TypeArray.length; i++) {
            if (ext == TypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}

// calling function here..
FileOrganiser(sourcePath[0]);

console.log("successfully completed");