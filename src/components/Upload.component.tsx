import React, { useState } from "react";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin-top: 20px;
`;

interface UploadComponentProps {
  onFileSubmit: (image: string) => void;
}

const UploadComponent = (props: UploadComponentProps) => {
  const { onFileSubmit } = props;
  const [imagePreview, setImagePreview] = useState<any>("");

  const photoUpload = (e: any) => {
    e.preventDefault();
    let alterada = false;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!reader || !file) {
      return;
    }
    reader.onloadend = function () {
      if (alterada) {
        return;
      }
      alterada = true;
      const binaryString = reader.result as string;
      reader.readAsBinaryString(file);
      setImagePreview(reader.result);
      onFileSubmit(binaryString);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container>
      {imagePreview && (
        <img
          style={{ margin: "20px" }}
          width={100}
          src={imagePreview}
          alt="Icone adicionar"
        />
      )}
      <input
        type="file"
        id="file"
        accept=".jpef, .png, .jpg"
        onChange={photoUpload}
        src={imagePreview}
      />
    </Container>
  );
};
export default UploadComponent;
