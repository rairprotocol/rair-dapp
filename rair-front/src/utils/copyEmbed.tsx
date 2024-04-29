export const copyEmbebed = (videoId: number, contract: string) => {
  const iframe = `
      <iframe id="${videoId}" src="${
        import.meta.env.VITE_SERVER_URL
      }/watch/${contract}/${videoId}/stream.m3u8" width="800px" height="800px"></iframe>
    `;
  navigator.clipboard.writeText(iframe);
};
