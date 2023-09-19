export const imageUrlToBase64 = async url => {
    
  if(url == null){
      return null
    }
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((onSuccess, onError) => {
      try {
        const reader = new FileReader() ;
        reader.onload = function(){ onSuccess(this.result) } ;
        reader.readAsDataURL(blob) ;
      } catch(e) {
        onError(e);
      }
    });
  };