import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios, { AxiosRequestHeaders } from "axios";
import React from "react";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log("uploadFile to", url);

    const token = localStorage.getItem('authorization_token');
    const headers: AxiosRequestHeaders = {};
    if (token) {
      headers.Authorization = `Basic ${token}`;
    }

    // Get the presigned URL
    const response = await axios({
      method: "GET",
      url,
      params: {
        name: encodeURIComponent(file.name),
      },
      headers,
    });
    
    console.log("File to upload: ", file.name);
    console.log("Uploading to: ", response.data.url);

    const result = await fetch(response.data.url, {
      method: "PUT",
      body: file,
    });

    console.log("Result: ", result);
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
