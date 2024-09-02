
export const fetchFaqSampleData = async () => {
    const response = await fetch('/data/faq.json');
    const data = await response.json();
    return data;
}