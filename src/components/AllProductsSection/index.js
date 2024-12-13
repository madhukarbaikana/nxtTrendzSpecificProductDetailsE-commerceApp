import {useState,useEffect} from 'react'
import {ThreeDots} from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const AllProductsSection =()=> {
const [productsList,setProductsList]=useState([])
const [apiStatus,setApiStatus]=useState(apiStatusConstants.initial)
const [activeOptionId,setActiveOptionId]=useState(sortbyOptions[0].optionId)
const [activeCategoryId,setActiveCategoryId]=useState("")
const [activeRatingId,setActiveRatingId]=useState("")
const [searchInput,setSearchInput]=useState("")

    useEffect(()=>{
getProducts()
    },[activeOptionId,activeCategoryId,activeRatingId])

 const  getProducts = async () => {
   setApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
try{
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
     setApiStatus(apiStatusConstants.success)
     setProductsList(updatedData)

    } else {
     setApiStatus(apiStatusConstants.failure)
    }}catch(error){
      setApiStatus(apiStatusConstants.failure)
    }
  }

const  clearFilters = () => {
      setSearchInput("")
   setActiveCategoryId("")
   setActiveRatingId("")
  }
  
 const changeSortby = activeOptionId => {
  setActiveOptionId(activeOptionId)
}

 const changeRating = activeRatingId => {
    setActiveRatingId(activeRatingId)
  }

 const  changeCategory = activeCategoryId => {
     setActiveCategoryId(activeCategoryId)
  }

  const enterSearchInput = () => {
    getProducts()
  }

const  changeSearchInput = searchInput => {
   setSearchInput(searchInput)
  }

const  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

const  renderProductsListView = () => {
   
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

const  renderLoadingView = () => (
    <div className="products-loader-container">
      <ThreeDots color="#0b69ff" height="80" width="80" />
    </div>
  )

const  renderAllProducts = () => {
    
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderProductsListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

    return (
      <div className="all-products-section">
        <FiltersGroup
          searchInput={searchInput}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeSearchInput={changeSearchInput}
          enterSearchInput={enterSearchInput}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          changeCategory={changeCategory}
          changeRating={changeRating}
          clearFilters={clearFilters}
          getProducts={getProducts}
        />
        {renderAllProducts()}
      </div>
    )
  
}

export default AllProductsSection
