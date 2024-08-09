// Write your code here
import './index.css'
const SimilarProductItem = props => {
  const {similarProductDt} = props
  const {imageUrl, title, brand, price, rating} = similarProductDt
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-thumbnail"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-product-details">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
