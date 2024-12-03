import React, { useState,useEffect } from "react";
import { S3Client, ListObjectsV2Command, GetObjectCommand, ListBucketInventoryConfigurationsOutputFilterSensitiveLog } from '@aws-sdk/client-s3';
import Editor from '@monaco-editor/react';

const s3 = new S3Client({
    region: 'us-east-1', // Replace with your region
    endpoint: 'https://gateway.storjshare.io', // Storj S3 Gateway endpoint
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY, // Your Access Key
      secretAccessKey:process.env.REACT_APP_SECRET_KEY, // Your Secret Key
    },
});

const listFiles = async () => {
    try {
      const data = await s3.send(new ListObjectsV2Command({ Bucket: 'idecode' }));
      //console.log('Files in S3 bucket:', data.Contents);
      return data.Contents;
    } catch (err) {
      console.error('Error listing files:', err);
    }
};

const getFile = async (fileKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: 'idecode',
        Key: fileKey,
      });
      const data = await s3.send(command);
      //console.log('File data:', data.Body);
      return data.Body;
    } catch (err) {
      console.error('Error retrieving file:', err);
    }
};

const Files = ()=>{
    const [files,setFiles] = useState([]);

    useEffect(() => {
      const fetchFiles = async () => {
        try{
        const fileList = await listFiles();
        setFiles(fileList);
        }catch(error){
          console.log("ERROR : ",error);
        }
      };
      fetchFiles();
    }, []);

    const handleFileClick = (fileKey) => {
      getFile(fileKey).then((fileData) => {
        console.log('File data:', fileData);
      });
    };

    return(
      <div className="folder">
          <div className="file">
            <center><h3>ideCode</h3></center>
             {files.map((file, index) => (
                  <div className="list" key={index} onClick={() => handleFileClick(file.Key)}> 
                   <center>{file.Key}</center>
                  </div>
             ))}
          </div>

          <div className="editor">
             <Editor height="100vh" theme="vs-dark" defaultLanguage="javascript" defaultValue="// some comment" />
          </div>
      </div>
    );
}

export default Files;