(function() { `use strict`;

// *****************************************************************************
// Content "common" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.GENERAL|
    Content "general": an unexpected error occurred.`);

// *****************************************************************************
// Content "create" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.CREATE.GENERAL|
    Content "create": an unexpected error occurred.`);

// *****************************************************************************
// Content "read" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.READ.GENERAL|
    Content "read": an unexpected error occurred.`);

// *****************************************************************************
// Content "update" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.UPDATE.GENERAL|
    Content "update": an unexpected error occurred.`);

// *****************************************************************************
// Content "delete" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.DELETE.GENERAL|
    Content "delete": an unexpected error occurred.`);

setError(`500|ERRORS.CONTENT.DELETE.READ_CONTENTS|
    Content "delete": error with reading contents to extract filenames.`);

setError(`500|ERRORS.CONTENT.DELETE.EXTRACT_FILES|
    Content "delete": error with extracting filenames.`);

setError(`500|ERRORS.CONTENT.DELETE.DELETE_FILES|
    Content "delete": error with deleting files.`);

setError(`500|ERRORS.CONTENT.DELETE.DELETE_CONTENTS|
    Content "delete": error with deleting the contents.`);

// *****************************************************************************
// Content "delete content image files" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.DELETE_CONTENT_IMAGE_FILES.GENERAL|
    Content "delete files": an unexpected error occurred.`);

// *****************************************************************************
// Content "delete files" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.DELETE_FILES.GENERAL|
    Content "delete files": an unexpected error occurred.`);

setError(`500|ERRORS.CONTENT.DELETE_FILES.FILE_DOES_NOT_EXIST|
    Content "delete files": error since the file does not exist (anymore).`);

// *****************************************************************************
// Content "test name" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.TEST_NAME.GENERAL|
    Content "test name": an unexpected error occurred.`);

// *****************************************************************************

})();