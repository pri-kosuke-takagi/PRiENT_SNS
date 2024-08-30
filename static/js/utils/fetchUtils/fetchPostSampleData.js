

export const fetchPostSampleData = async () => {
    try {
        const response = await fetch('/data/posts.json');
        const data = await response.json();
        console.log('This is post data from fetchPostSampleData: ', data);
        return data;
    } catch (error) {
        console.error('Error fetching post sample data: ', error);
        return [];
    }
}