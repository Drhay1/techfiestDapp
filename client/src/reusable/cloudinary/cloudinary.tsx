import { useState } from 'react';
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUpload {
  setUploadedImageUrl?: (param: string) => any;
  uploadedImageUrl?: string | null;
  width?: string;
  height?: string;
}

const FileUpload = ({ setUploadedImageUrl, uploadedImageUrl }: FileUpload) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadClicked, setUploadClicked] = useState(false);
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
  const cloud_name = import.meta.env.VITE_CLOUDINARY_NAME;

  //================handling file upload Drag and Drop ================//
  const onDrop = useCallback((acceptedFiles: string | any[]) => {
    if (acceptedFiles?.length) {
      console.log(acceptedFiles[0]);
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //================handling file upload================//

  const handleFileUpload = async () => {
    if (
      selectedFile &&
      (selectedFile.type === 'image/jpeg' ||
        selectedFile.type === 'image/JPEG' ||
        selectedFile.type === 'image/png' ||
        selectedFile.type === 'image/JPG' ||
        selectedFile.type === 'image/PNG' ||
        selectedFile.type === 'image/jpg')
    ) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('cloud_name', cloud_name);
        formData.append('upload_preset', upload_preset);
        console.log(formData);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );
        // console.log(response);

        if (response.ok) {
          console.log('File uploaded successfully!');
          const data = await response.json();
          console.log(data);
          setUploadedImageUrl(data.secure_url);
        }
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    }

    setUploadClicked(true);
  };

  return (
    <HStack spacing={4} align="center">
      <Box
        {...getRootProps()}
        w="100px"
        h="100px"
        borderRadius="10px"
        border="2px"
        alignContent="center"
      >
        {uploadClicked ? (
          uploadedImageUrl && (
            <Image
              src={uploadedImageUrl}
              alt="Uploaded Logo"
              borderRadius="10px"
              width="100%"
              height="100%"
              align="center"
            />
          )
        ) : (
          <>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Text py="20px" align="center">
                Drop the files here ...
              </Text>
            ) : (
              <Text py="20px" align="center">
                Company Logo
              </Text>
            )}
          </>
        )}
      </Box>

      <Button mt="30px" onClick={handleFileUpload}>
        Upload Logo
      </Button>
    </HStack>
  );
};

export default FileUpload;
