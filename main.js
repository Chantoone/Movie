const fetchApi = async () =>{
    const response = await fetch("https://dummyjson.com/products");
    const result = await response.json()
    console.log(result.products)
}
fetchApi();