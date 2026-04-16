import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/Roboto-VariableFont_wdth,wght.ttf",
      fontWeight: "normal",
      fontStyle: "normal",
    },
    {
      src: "/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: "/fonts/Roboto-VariableFont_wdth,wght.ttf",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});
