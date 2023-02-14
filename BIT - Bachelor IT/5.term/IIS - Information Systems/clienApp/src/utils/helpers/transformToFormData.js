/**
 * Author: Lukáš Plevač
 */
function getFormData(object) {
    var formData = new FormData();
    //Iterate throw object and append formData
    Object.keys(object).forEach((key) => {
      if (object[key] === undefined || object[key] === null) {
        return false;
      }
  
      //If its array, each value must be appended separe
      if (Array.isArray(object[key])) {
        for (let i = 0; i < object[key].length; i++) {
          formData.append(key, object[key][i]);
        }
      } else if (object[key] instanceof Date) {
        formData.append(key, object[key].toUTCString());
      } else if (
        typeof object[key] === "object" &&
        !(object[key] instanceof File)
      ) {
        Object.keys(object[key]).forEach((key2) => {
          formData.append(key + "[" + key2 + "]", object[key][key2]);
        });
      } else {
        formData.append(key, object[key]);
      }
    });
  
    return formData;
  }
  
  export default getFormData;