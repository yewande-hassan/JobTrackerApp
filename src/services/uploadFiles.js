// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "./firebase";

// export async function uploadFiles(file, folder = "uploads") {
//   if (!file) return "";
//   try {
//     const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
//     await uploadBytes(storageRef, file);
//     return await getDownloadURL(storageRef);
//   } catch (error) {
//     console.error("File upload failed:", error);
//     return "";
//   }
// }

// uploadFiles.js
// import { storage } from "./firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// export async function uploadFiles(file, folderName) {
//   if (!file) return null;

//   const timestamp = Date.now();
//   const fileRef = ref(storage, `${folderName}/${timestamp}_${file.name}`);
  
//   // Upload the file
//   await uploadBytes(fileRef, file);
  
//   // Get and return the public download URL
//   const fileUrl = await getDownloadURL(fileRef);
//   return fileUrl;
// }


import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export async function uploadFiles(file, folderName) {
  if (!file) {
    console.log("No file passed, skipping upload for:", folderName);
    return null;
  }

  console.log("Starting upload for file:", file.name, "folder:", folderName);

  const timestamp = Date.now();
  const filePath = `${folderName}/${timestamp}_${file.name}`;
  const fileRef = ref(storage, filePath);
  console.log("Storage ref path:", fileRef.fullPath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("UploadTask error:", error);  
        reject(error);
      },
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload successful, download URL:", fileUrl);
          resolve(fileUrl);
        } catch (err) {
          console.error("Failed to get download URL:", err);
          reject(err);
        }
      }
    );
  });
}



