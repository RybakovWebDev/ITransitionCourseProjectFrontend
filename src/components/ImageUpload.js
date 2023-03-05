import { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const lang = localStorage.getItem("language") || "eng";

const ImageUpload = (props) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dcwkrlvkj",
        uploadPreset: "uaczpkh0",
        sources: ["local"],
        theme: "minimal",
        styles: {
          frame: {
            background: "rgb(49, 49, 49, 0.6)",
          },
        },
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
        if (!err && result && result.event === "success") {
          props.collectionsHandler("imageUrl", result.info.url);
        }
      }
    );
  }, []);
  return (
    <Button variant='btn btn-outline-dark' onClick={() => widgetRef.current.open()}>
      {props.image
        ? lang === "eng"
          ? "Change image"
          : "Изменить изображение"
        : lang === "eng"
        ? "Add image"
        : "Добавить изображение"}
    </Button>
  );
};

export default ImageUpload;
