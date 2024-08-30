
export const fetchUserSampleData = async () => {
    const response = await fetch('/data/users.json');
    const data = await response.json();
    return data;
}