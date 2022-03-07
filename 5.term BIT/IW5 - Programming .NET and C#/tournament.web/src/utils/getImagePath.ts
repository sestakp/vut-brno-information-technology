
export default function getImagePath(imagePath: string | undefined): string{
    
    let imageSrc = "/defaultImage.png";

    
    if(imagePath !== undefined && imagePath !== null && process.env.REACT_APP_API_URL !== undefined){
      imageSrc = process.env.REACT_APP_API_URL.slice(0, -1) + imagePath;
    }
    return imageSrc;

}