export const convertImageToFileList = (url: string) => {
  if (!url) return [];

  return [
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: url,
    },
  ];
};
