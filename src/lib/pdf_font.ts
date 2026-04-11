import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/src/assets/fonts/Roboto-VariableFont_wdth,wght.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/src/assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/src/assets/fonts/Roboto-VariableFont_wdth,wght.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/src/assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});
