/**
 * ファイルがアップロードされた時に、ファイルをBlobとして読み込み、そのBlobからURLを生成する関数
 * @param {*} file 
 */
export const createUrlFromImageFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const blob = new Blob([arrayBuffer], { type: file.type });

            const imageUrl = URL.createObjectURL(blob);
            // 例: imageUrl
            // "blob:http://127.0.0.1:5500/46c22055-fc1d-46e4-a1f9-b945312beacf"
            console.log('This is imageUrl: ', imageUrl);
            resolve(imageUrl);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}