
export default class DateHelper {
    static formatDate = (date) => {
        var options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('sv', options);
    }
}