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
            console.log('This is imageUrl: ', imageUrl);
            resolve(imageUrl);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsArrayBuffer(file);
    });
}