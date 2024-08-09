import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import './index.css'

const differentView = {
  success: 'SUCCESS',
  inProgress: 'PROGRESS',
  failure: 'FAIL',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: null,
    apiStatus: differentView.inProgress,
    productCount: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  incProductCount = () => {
    this.setState(prevState => ({
      productCount: prevState.productCount + 1,
    }))
  }

  decProductCount = () => {
    const {productCount} = this.state
    if (productCount > 1) {
      this.setState(prevSt => ({
        productCount: prevSt.productCount - 1,
      }))
    }
  }

  getProductDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {id} = this.props.match.params

    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(productDetailsApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const formattedProductDetails = {
          availability: data.availability,
          brand: data.brand,
          description: data.description,
          id: data.id,
          imageUrl: data.image_url,
          price: data.price,
          rating: data.rating,
          similarProducts: data.similar_products.map(product => ({
            id: product.id,
            imageUrl: product.image_url,
            title: product.title,
            style: product.style,
            price: product.price,
            description: product.description,
            brand: product.brand,
            totalReviews: product.total_reviews,
            rating: product.rating,
            availability: product.availability,
          })),
          style: data.style,
          title: data.title,
          totalReviews: data.total_reviews,
        }
        this.setState({
          productDetails: formattedProductDetails,
          apiStatus: differentView.success,
        })
      } else {
        this.setState({apiStatus: differentView.failure})
      }
    } catch (error) {
      console.log(error.message)
      this.setState({apiStatus: differentView.failure})
    }
  }

  navigateToProductRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-aling">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  successView = () => {
    const {productDetails, productCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      similarProducts,
      style,
      title,
      totalReviews,
    } = productDetails
    return (
      <div className="success-view-section">
        <div className="product-details-section">
          <img src={imageUrl} className="img" alt="product" />
          <div className="product-item-details">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-rating-review">
              <div className="product-rating-container">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="product-star"
                />
              </div>
              <p className="product-review">{totalReviews} Reviews</p>
            </div>

            <p className="product-description">{description}</p>
            <p className="product-availability">
              <span className="available">Available: </span>
              {availability}
            </p>
            <p className="product-brand">
              <span className="brand">Brand: </span>
              {brand}
            </p>
            <hr className="horizontal-line" />
            <div className="controll-section">
              <button
                data-testid="plus"
                className="plus-icon-btn"
                onClick={this.incProductCount}
              >
                <BsPlusSquare />
              </button>
              <p className="product-count">{productCount}</p>
              <button
                data-testid="minus"
                className="minus-icon-btn"
                onClick={this.decProductCount}
              >
                <BsDashSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-product-section">
          <h1>Similar Products</h1>
          <ul className="similar-product">
            {similarProducts.map(similarProduct => (
              <SimilarProductItem
                key={similarProduct.id}
                similarProductDt={similarProduct}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div className="failure-view-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-btn"
        onClick={this.navigateToProductRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderDifferentView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case differentView.inProgress:
        return this.renderLoader()
      case differentView.success:
        return this.successView()
      case differentView.failure:
        return this.failureView()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderDifferentView()}
      </>
    )
  }
}

export default ProductItemDetails
