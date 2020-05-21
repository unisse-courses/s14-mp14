import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col } from 'antd';
import NovelImage from './Sections/NovelImage';
import NovelInfo from './Sections/NovelInfo';


function DetailNovel(props) {
    
    const novelId = props.match.params.noveltId
    const [Novel, setNovel] = useState([])

    useEffect(() => {
        Axios.get(`/api/novel/novels_by_id?id=${novelId}&type=single`)
            .then(response => {
                setNovel(response.data[0])
            })

    }, [])


    return (
        <div className="postPage" style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Novel.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} xs={24}>
                    <NovelImage detail={Novel} />
                </Col>
                <Col lg={12} xs={24}>
                    <NovelInfo detail={Novel}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailNovel
