import React, { useState } from 'react'
import { Checkbox, Collapse } from 'antd';

const { Panel } = Collapse

const genres = [
    {
        "_id": 1,
        "name": "Action"
    },
    {
        "_id": 2,
        "name": "Adventure"
    },
    {
        "_id": 3,
        "name": "Drama"
    },
    {
        "_id": 4,
        "name": "Horror"
    },
    {
        "_id": 5,
        "name": "Comedy"
    },
    {
        "_id": 6,
        "name": "Fantasy"
    },
    {
        "_id": 7,
        "name": "Sci-fi"
    },
    {
        "_id": 8,
        "name": "Shounen"
    },
    {
        "_id": 9,
        "name": "Slice of life"
    },
    {
        "_id": 10,
        "name": "Shoujo"
    }
]



function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {


        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];


        //these are the same values
        //console.log(value)              //value of the checkbox
        //console.log(genres[value-1]._id)//value of the genre using index of the checkbox-1
        

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)
        props.handleFilters(newChecked)
        // console.log(newChecked)
        //update this checked information into Parent Component h a a h

    }

    const renderCheckboxLists = () => genres.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox
                onChange = {() => handleToggle(value._id)}
                type="checkbox"
                //checked = {Checked.indexOf(value._id) === -1 ? false : true}
            />
            <span>{value.name}</span>
        </React.Fragment>
    ))
    // console.log(Checked.indexOf(value._id))
    // console.log(genres[0])   //returns _id 1, and name "Action"
    //console.log(genres[0]._id) //returns 1


    /*
        {genres.map((value, index) => (
                        <React.Fragment key={index}>
                            <Checkbox
                                onChange
                                type="checkbox"
                                checked
                            />
                            <span>{value.name}</span>
                        </React.Fragment>
                    ))}
    */
    
    
    return (
        <div>
            <Collapse defaultActiveKey={['1']} >
                <Panel header = "Filter by Genre" key="1">
                {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox