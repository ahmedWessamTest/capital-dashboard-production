export function toFormData<T extends object>(data:T):FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key=>{
        const value = data[key as keyof T];
        if(value !== undefined && value !== null) {
            formData.append(key,value.toString());
        }
    })
    return formData;
}