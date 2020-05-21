import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import SearchFeature from './Sections/SearchFeature';
import { get } from 'mongoose';


const { Meta } = Card;

function LandingPage() {

    const [Novels, setNovels] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")
    const [Filters, setFilters] = useState({
        genres: []
    })
    
    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getNovels(variables)

    }, [])

    const getNovels = (variables) => {
        Axios.post('/api/novel/getNovels', variables)
            .then(response => {
                if (response.data.success) {
                    
                    if(variables.loadMore){
                        setNovels([...Novels, ...response.data.novels])
                    } else {
                        setNovels(response.data.novels)
                    }
                    setPostSize(response.data.postSize)
                    //console.log(response.data.novels)
                    //to fix, returns list but genre is all 1
                   
                } else {
                    alert('Failed to fetch novel datas')
                }
            })      
    }

    /*
    useEffect(() => {
        Axios.post('/api/novel/getNovels')
            .then(response => {
                if (response.data.success) {
                    
                    
                    setNovels(response.data.novels)

                    console.log(response.data.novels)
                   
                } else {
                    alert('Failed to fectch novel datas')
                }
            })
        }, [])
    
    */
    const onLoadMore = () => {
        let skip = Skip + Limit;
        
        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true

        }
        getNovels(variables)

        setSkip(skip)
    }
    const renderCards = Novels.map((novel, index) => {

        return <Col lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<a href={`/novel/${novel._id}`} > <ImageSlider images={novel.images} /></a>}
            >
                <Meta
                    title={novel.title}
                    description={novel.genre}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {

        const variables = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getNovels(variables)    //not working
        setSkip(0)  //refreshes page

        // console.log(filters)//works //array of filters by first ticked

    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        //category = "genres"
        newFilters[category] = filters
        console.log(category)
        console.log(filters)

        // console.log(newFilters)// array of filters by first ticked

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {
        
        //console.log(newSearchTerm);
        
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getNovels(variables)

        
    }

    return (
        <div style={{ width: '75%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>  Browse Light Novels    </h2>
            </div>


            <CheckBox
                handleFilters={filters => handleFilters(filters, "genres")}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>

                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />

            </div>

            {Novels.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div>
                   <Row gutter={[16, 16]}>

                    
                
                    {renderCards}
                    </Row>


                </div>
            }

            <br /><br />

            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
