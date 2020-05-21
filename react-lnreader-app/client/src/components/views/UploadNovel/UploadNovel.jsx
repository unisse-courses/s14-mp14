import React, {useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;


const Genres = [
    { key: 1, value: "Action" },
    { key: 2, value: "Adventure" },
    { key: 3, value: "Drama" },
    { key: 4, value: "Horror" },
    { key: 5, value: "Comedy" },
    { key: 6, value: "Fantasy" },
    { key: 7, value: "Sci-fi" },
    { key: 8, value: "Shounen" },
    { key: 9, value: "Slice of life" },
    { key: 10, value: "Shoujo" }
]

function UploadNovel(props){

    const [TitleValue, setTitleValue] = useState("")
    const [GenreValue, setGenretValue] = useState(1)
    const [DescriptionValue, setDescriptionValue] = useState("")

    const [Images, setImages] = useState([])

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const onGenreSelectChange = (event) => {
        setGenretValue(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        console.log(newImages)
        setImages(newImages)
    }

    const onSubmit = (event) => {
        event.preventDefault();


        if (!TitleValue || !DescriptionValue || !GenreValue || !Images) {
            return alert('fill all the fields first!')
        }

        const variables = {
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            images: Images,
            genres: GenreValue,
        }

        Axios.post('/api/novel/uploadNovel', variables)
            .then(response => {
                if (response.data.success) {
                    alert('Product Successfully Uploaded')
                    props.history.push('/')
                } else {
                    alert('Failed to upload Product')
                }
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Title level={2}> Upload your Novel</Title>
            </div>
            <Form onSubmit={onSubmit} >


            <FileUpload refreshFunction={updateImages} />
            <br/>
            <br/>
            <label>Title</label>
            <Input
                onChange={onTitleChange}
                value={TitleValue}
            />
            <br/>
            <br/>
            <label>Genre</label>
            <br/>
            <select onChange={onGenreSelectChange} value={GenreValue}>
                    {Genres.map(item => (
                        <option key={item.key} value={item.key}>{item.value} </option>
                    ))}
            </select>
            <br/>
            <br/>
            <label>Description</label>
            <br/>
            <TextArea
                onChange={onDescriptionChange}
                value={DescriptionValue}
            />
            <br/>
            <br/>
            <Button onClick={onSubmit}>
                    Submit
            </Button>

            </Form>

        </div>

    )
}

export default UploadNovel
