export const formatDate = (isoDate, options = { year: 'numeric', month: 'long', day: 'numeric' }, locale = 'en-US') => {
    const date = new Date(isoDate);
    
    // Extract year, month, and day components in UTC
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // Note: month is 0-indexed (0 = January, 11 = December)
    const day = date.getUTCDate();

    // Define month names for better formatting
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Construct the formatted date
    return `${monthNames[month]} ${day}, ${year}`;
}