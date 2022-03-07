/*
CITE:https://stackoverflow.com/questions/64783894/how-to-use-react-dropzone-with-react-hook-form
*/
/**
 * Author: Pavel Šesták
 */
import React, {useCallback, useState, useEffect} from 'react';
import { useFormContext, Controller } from "react-hook-form";
import {useDropzone} from "react-dropzone";
import {default as DZ} from 'react-dropzone'
import File from "./File/File";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./FileUploader.css"

function Dropzone (props){
    const { control } = useFormContext()
  
    return (
      <Controller
        render={({ field: { onChange } }) => (
          <DropzoneBase
            multiple={props.multiple}
            changeFunc={(e) =>
                {
                  if(e === null){
                    return onChange(null);
                  }

                  let files = e.target.files;

                  if(props.multiple){
                    return onChange(files);
                  }
                  else{
                    if(files !== null){
                      return onChange(files[0]);
                    }
                  } 
                }
            }
            value={props.value}
            fieldName={props.fieldName}
          />
        )}
        name={props.fieldName}
        control={control}
        defaultValue=''
      />
    )
  }

  const DropzoneBase = (props) => {

    const {
      getRootProps,
      getInputProps,
    } = useDropzone(props)

 
    
    const [image, setImage] = useState(null);
    
    const urlToObject = async(src)=> {
      try{
        const response = await fetch(src);
        // here image is url/location of image
        const blob = await response.blob();
  
        //get image name
        let splitBySlash = src.split("\\");
        let imageNameSeparedByUnderline = splitBySlash[splitBySlash.length - 1].split('_');
        imageNameSeparedByUnderline.shift(); //remove guid
        let imageName = imageNameSeparedByUnderline.join('_');
  
  
        const file = new File([blob], imageName, {type: blob.type});
        props.changeFunc({target: { files: [file]}})
      } 
      catch{
        
      }     
    }

    useEffect(() => {
      if(props.value !== null && props.value !== undefined){
        let defaultImageSrc =  process.env.REACT_APP_API_URL+props.value;
        setImage(defaultImageSrc)
        urlToObject(defaultImageSrc);
      }
    }, [props.value])

    
    
    const onDrop = useCallback(acceptedFiles => {
      acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        let result = e.target?.result;
        
        if(result !== undefined){
          setImage(result);
          props.changeFunc({target: { files: [file]}})
        }
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

    //@see https://react-dropzone.js.org/
    return(
        <DZ onDrop={onDrop}  >
        {({getRootProps, getInputProps}) => (
            <section className="dropZone">
                    {image === null ? 
                      <div {...getRootProps()}>
                        <input {...getInputProps({onChange: props.changeFunc})} />  
                        <AiOutlineCloudUpload className="m-auto w-100" size={80} style={{color: "blue"}} />
                        <p>Drop files or Click to Browse</p> 
                      </div>
                    :
                      <File image={image} setImage={setImage} changeFunc={props.changeFunc}/>
                    }
            </section>
        )}
        </DZ>
    )
  }

  export default Dropzone;