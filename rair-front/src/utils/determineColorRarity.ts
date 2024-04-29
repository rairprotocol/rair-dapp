export function determineRarity(metadata) {
  let totalRarity = 0;

  metadata.attributes.forEach((attribute) => {
    const percentage = parseInt(attribute.percentage.replace('%', ''));
    totalRarity += percentage; // Accumulate the percentages
  });

  const averageRarity = totalRarity / metadata.attributes.length;

  // Adjust the color value based on average rarity
  if (averageRarity >= 100) {
    metadata.color = 'rgb(25,167,246)';
  } else if (averageRarity >= 50) {
    metadata.color = 'rgb(114,91,219)';
  } else {
    metadata.color = 'rgb(232,130,213)';
  }

  return metadata;
}
