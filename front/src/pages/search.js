import { React, useEffect} from 'react'


function List(props) {
    var responseData;
    const search = async () => {
        // var input, filter, ul, li, a, i, txtValue;
        // input = document.getElementById("search-text");
        // filter = input.value.toUpperCase();
        // ul = document.getElementById("search-list");
        // li = ul.getElementsByTagName("li");
        try{
            const response = await fetch('http://localhost/api/search-provinces',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            responseData = await response.json();
            console.log(responseData.province);
        } catch(err) {
            console.log(err)
        }
    }
    useEffect(() => {

    });
    return (
        <ul>
            {responseData.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    )
}


function List(data) {
    return (
        <ul>
            {data.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    )
}


export default List
