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

const Dropzone = ({
    name,
    multiple,
    fieldName,
    ...rest
  }) => {
    const { control } = useFormContext()
  
    return (
      <Controller
        render={({ field: { onChange } }) => (
          <DropzoneBase
            multiple={multiple}
            changeFunc={(e) =>
                {
                    console.log("Main change func: ", e);
                    return onChange(multiple ? e?.target?.files : e?.target?.files[0]);
                }
            }
            {...rest}
            fieldName={fieldName}
          />
        )}
        name={fieldName}
        control={control}
        defaultValue=''
      />
    )
  }
  
  const DropzoneBase = ({
    multiple,
    changeFunc,
    ...rest
  }) => {

    const {
      getRootProps,
      getInputProps,
    } = useDropzone({
      multiple,
      ...rest,
    })

 
    
    const [image, setImage] = useState(null);
    
    const urlToObject= async(src)=> {
      const response = await fetch(image);
      // here image is url/location of image
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', {type: blob.type});
      console.log(file);
      changeFunc({target: { files: [file]}})
    }

    useEffect(() => {
      if(rest.value !== null){
        let defaultImageSrc =  process.env.REACT_APP_URL+rest.value;
        setImage({id: "cuid", src: defaultImageSrc})
        urlToObject(defaultImageSrc);
        console.log("defaultImgSource: ", defaultImageSrc);
      }
    }, [rest.value])

    
    
    const onDrop = useCallback(acceptedFiles => {
      console.log(acceptedFiles)
      acceptedFiles.map(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImage({ id: "cuid()", src: e.target.result });
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
                <div {...getRootProps()}>
                    <input {...getInputProps({onChange: changeFunc})} />
                    {image === null ? 
                      <>  
                        <AiOutlineCloudUpload className="m-auto w-100" size={80} style={{color: "blue"}} />
                        <p>Drop files or Click to Browse</p> 
                      </>
                    :
                      <Image image={image} setImage={setImage} changeFunc={changeFunc}/>
                    }
                    
                    
                </div>
            </section>
        )}
        </DZ>
    )
  }

  export default Dropzone;