/**
 * Clean value
 * @param value Value to change
 */
export function getCleanedString(value: string): string {
  // We define the characters we want to delete
  const specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.'";

  // We eliminate them all
  for (let i = 0; i < specialChars.length; i++) {
    value = value.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
  }

  // We want to return it clean in lowercase
  value = value.toLowerCase();

  // We remove spaces and replace them with _ because we like it more like this
  value = value.replace(/ /g, ' ');

  // We remove accents and "ñ". Notice that the first valueeter goes without quotes
  value = value.replace(/á/gi, 'a');
  value = value.replace(/é/gi, 'e');
  value = value.replace(/í/gi, 'i');
  value = value.replace(/ó/gi, 'o');
  value = value.replace(/ú/gi, 'u');
  value = value.replace(/ñ/gi, 'n');

  // Return value
  return (value !== undefined && value !== null) ? `${value}` : '';
}

/**
 * Get current date
 */
export function getCurrentDate(): string {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  return year + '-' + month + '-' + date;
}
