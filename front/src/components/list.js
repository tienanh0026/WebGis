import React, { useState } from "react";
import data from "./ListData.json"

function List(props) {
    const [x1, setX] = useState(false);

    function findObject(id,map){
        setX(x1 => !x1);
        var object = document.getElementsByClassName("house") ;
        // var map_object = document.getElementById(map);
        
        console.log(object);
        if(x1){
            for(var i=0;i<object.length;i++){
                object[i].style.filter = "brightness(100%)"
                if(i===id){
                    object[id].style.filter= "brightness(150%)";
                }
            }
            setX(x1 => !x1);
        }
        else{
            for(var i1=0;i1<object.length;i1++){
                object[i1].style.filter = "brightness(100%)"
            }
        }
    }
    const filteredData = data.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.text.toLowerCase().includes(props.input)
        }
    })
    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id} id={'tower'+item.id} onClick={()=>findObject(item.id-1)}>{item.text}</li>
            ))}
        </ul>
    )
}

export default List
