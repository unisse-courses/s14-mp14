import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd';

function NovelInfo(props) {

    const [Novel, setNovel] = useState({})

    useEffect(() => {

        setNovel(props.detail)

    }, [props.detail])



    return (
        <div>
            <Descriptions title="Novel Info">
                <Descriptions.Item label="Author"> {Novel.writer}</Descriptions.Item>
                <Descriptions.Item label="Genre">{Novel.genre}</Descriptions.Item>
                <Descriptions.Item label="View"> {Novel.likes}</Descriptions.Item>
                <Descriptions.Item label="Description"> {Novel.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger">
                    Favorite
                </Button>
            </div>
        </div>
    )
}

export default NovelInfo

