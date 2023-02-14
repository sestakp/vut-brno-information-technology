/*
CITE:https://stackoverflow.com/questions/64783894/how-to-use-react-dropzone-with-react-hook-form
*/

import React, {useCallback, useState, useEffect} from 'react';
import { useFormContext, Controller } from "react-hook-form";
import {useDropzone} from "react-dropzone";
import {default as DZ} from 'react-dropzone'
import Image from "./Image/Image";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./Dropzone.css"

interface DropZoneProps{
  multiple: any,
  fieldName: any,
  value: any,
  key: any
}

function Dropzone (props: DropZoneProps){
    const { control } = useFormContext()
  
    return (
      <Controller
        render={({ field: { onChange } }) => (
          <DropzoneBase
            multiple={props.multiple}
            changeFunc={(e: any) =>
                {
                  console.log("Main change func: ", e);
                  if(e === null){
                    return onChange(null);
                  }

                  let files = e.target.files;
                  console.log("files: ", files)

                  if(props.multiple){
                    return onChange(files);
                  }
                  else{
                    if(files !== null){
                      console.log("onChange hook param: ", files[0])
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
  
  interface DropzoneBaseProps{
    multiple: any,
    changeFunc: any,
    value: any,
    fieldName: any,
  }

  const DropzoneBase = (props: DropzoneBaseProps) => {

    const {
      getRootProps,
      getInputProps,
    } = useDropzone(props)

 
    
    const [image, setImage] = useState<string | null>(null);
    
    const urlToObject = async(src: string)=> {
      try{
        console.log("url to object: ", src)
        const response = await fetch(src);
        // here image is url/location of image
        const blob = await response.blob();

        const file = new File([blob], "image.png", {type: blob.type});
        console.log("File: ", file);
  
        const reader = new FileReader();
        reader.onload = function(e) {
          let result = e.target?.result;
          if(result !== undefined){
            setImage(result as any);
            props.changeFunc({target: { files: [file]}})
          }
        }
        reader.readAsDataURL(file);  
      }
      catch{
        
      }
      
    }

    useEffect(() => {
      if(props.value !== null && process.env.REACT_APP_API_URL !== undefined){
        let defaultImageSrc = process.env.REACT_APP_API_URL.slice(0, -1)+props.value;
        //setImage(defaultImageSrc)
        urlToObject(defaultImageSrc);
      }
    }, [props.value])

    
    
    const onDrop = useCallback(acceptedFiles => {
      console.log(acceptedFiles)
      acceptedFiles.map((file: File) => {
      const reader = new FileReader();
      reader.onload = function(e: ProgressEvent<FileReader>) {
        let result = e.target?.result;
        
        if(result !== undefined){
          setImage(result as any);
          props.changeFunc({target: { files: [file]}})
        }
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

    //@see https://react-dropzone.js.org/
    return(
        <DZ onDrop={onDrop} accept={"image/*"}  >
        {({getRootProps, getInputProps}) => (
            <section className="dropZone">
                    {image === null ? 
                      <div {...getRootProps()}>
                        <input {...getInputProps({onChange: props.changeFunc})} />  
                        <AiOutlineCloudUpload className="m-auto w-100" size={80} style={{color: "blue"}} />
                        <p>Drop files or Click to Browse</p> 
                      </div>
                    :
                      <Image image={image} setImage={setImage} changeFunc={props.changeFunc}/>
                    }
            </section>
        )}
        </DZ>
    )
  }

  export default Dropzone;