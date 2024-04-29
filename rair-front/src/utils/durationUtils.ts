function formatDuration(duration: string): string {
  const durationParts: string[] = duration.split(':');

  let formattedDuration = '';

  // Check hours
  if (parseInt(durationParts[0], 10) > 0) {
    formattedDuration += parseInt(durationParts[0], 10) + ':';
  }

  // Check minutes
  const minutes = parseInt(durationParts[1], 10);
  if (minutes > 0 || formattedDuration !== '') {
    formattedDuration += minutes.toString().padStart(2, '0') + ':';
  } else {
    formattedDuration += '00:';
  }

  // Add seconds
  const seconds = parseInt(durationParts[2], 10);
  formattedDuration += seconds.toString().padStart(2, '0');

  return formattedDuration;
}

export default formatDuration;
