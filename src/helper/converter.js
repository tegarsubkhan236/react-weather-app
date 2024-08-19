// FormatTime is a helper function to format UNIX timestamp to 24-hour time
export const FormatTime = (unixTimestamp, language = 'en') => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (language === 'en') {
        // Format time in AM/PM format
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${period}`;
    } else {
        // Format time in 24-hour format
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }
};

// KelvinToCelsius is helper function to Convert Kelvin to Celsius
export const KelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

// MpsToKmph is helper function to Convert m/s to km/h
export const MpsToKmph = (mps) => (mps * 3.6).toFixed(1);

// CapitalizeFirstLetterOfEachWord is helper function to Capitalize first letter of each word
export const CapitalizeFirstLetterOfEachWord = (text) => {
    return text.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}