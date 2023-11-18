import { useState } from 'react';
import { Box, HStack, Image, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiOutlineCloudUpload } from 'react-icons/ai';

interface FileUpload {
  setUploadedImageUrl: (param: string) => any;
  uploadedImageUrl: string | any;
  width?: string;
  height?: string;
  logo: string | any;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => any;
}

const FileUpload = ({
  setUploadedImageUrl,
  setFieldValue,
  logo,
}: FileUpload) => {
  const [, /*selectedFile*/ setSelectedFile] = useState<any>(null);
  // const [uploadClicked, setUploadClicked] = useState(false);
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;

  //================handling file upload Drag and Drop ================//
  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles?.length) {
      setSelectedFile(acceptedFiles[0]);
      handleFileUpload(acceptedFiles[0]);
      console.log(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  //================handling file upload================//

  const handleFileUpload = async (theSelectedFile: any) => {
    if (
      theSelectedFile &&
      (theSelectedFile.type === 'image/jpeg' ||
        theSelectedFile.type === 'image/JPEG' ||
        theSelectedFile.type === 'image/png' ||
        theSelectedFile.type === 'image/JPG' ||
        theSelectedFile.type === 'image/PNG' ||
        theSelectedFile.type === 'image/jpg')
    ) {
      try {
        const formData = new FormData();
        formData.append('file', theSelectedFile);
        formData.append('cloud_name', cloud_name);
        formData.append('upload_preset', upload_preset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUploadedImageUrl(data.secure_url);
          setFieldValue && setFieldValue('logo', data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    }
  };

  return (
    <HStack spacing={4} align="center">
      <Box
        {...getRootProps({
          className: 'dropzone',
          onDrop: (e) => {
            e.preventDefault();
            onDrop(Array.from(e.dataTransfer.files) as File[]);
          },
        })}
        w="100px"
        h="100px"
        borderRadius="10px"
        border="2px"
        alignContent="center"
        position="relative"
      >
        <input {...getInputProps()} />
        {logo && (
          <Image
            src={logo || ''}
            borderRadius="10px"
            width="100%"
            height="100%"
          />
        )}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <AiOutlineCloudUpload size={32} />
        </Box>
        <Text fontSize={'10px'} pt={2} align="center" whiteSpace={'nowrap'}>
          JPG, PNG, JPEG
        </Text>
      </Box>
    </HStack>
  );
};

export default FileUpload;
