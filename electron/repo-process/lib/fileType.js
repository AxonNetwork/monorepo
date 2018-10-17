const path = require('path');

function fileType(fileName) {
    const extension = path.extname(fileName).substr(1);
    switch (extension) {
    case 'csv':
    case 'xls':
    case 'xlsx':
        return 'data';
    case 'py':
    case 'js':
    case 'go':
    case 'sol':
    case 'json':
        return 'code';
    case 'txt':
    case 'doc':
    case 'md':
        return 'text';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
        return 'image';
    default:
        return 'unknown';
    }
}

module.exports = fileType;
