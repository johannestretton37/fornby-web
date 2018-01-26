
export default class DateHelper {
    static formatDate = (date) => {
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('sv', options);
    }
}

export const camelCase = string => {
  const words = string.split('-')
  return words.map((word, i) => {
    if (i === 0) return word
    return word[0].toUpperCase() + word.toLowerCase().substr(1)
  }).join('')
}
