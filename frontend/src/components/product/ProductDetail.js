import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import { useCart } from '../../context/CartContext';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await apiCall(`/api/products/${id}`);
      setProduct(res.data.product);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product.variations?.length > 0) {
      if (selectedVariation === null) {
        alert('Please select a variation');
        return;
      }
      const variation = product.variations[selectedVariation];
      if (!user) {
        const { addToGuestCart } = await import('../../utils/guestCart');
        addToGuestCart(product.id, quantity, variation);
      } else {
        try {
          await apiCall('/api/cart/items', {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, quantity, variation })
          });
        } catch (error) {
          alert(`Error adding to cart`);
          return;
        }
      }
      refreshCart();
      alert('Added to cart!');
      setSelectedVariation(null);
      setQuantity(1);
      return;
    }
    
    if (!user) {
      const { addToGuestCart } = await import('../../utils/guestCart');
      addToGuestCart(product.id, quantity, null);
      refreshCart();
      alert('Added to cart!');
      return;
    }
    try {
      await apiCall('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, quantity, variation: null })
      });
      refreshCart();
      alert('Added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-blue-600">Products</a></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-4 bg-white rounded-lg p-4">
              <img
                src={product.images?.[selectedImage] || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && <p className="text-gray-600 mb-4">Brand: {product.brand}</p>}
            
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-lg">⭐ {product.rating}</span>
              <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
            </div>

            <div className="mb-6 pb-6 border-b">
              <span className="text-4xl font-bold text-blue-600">৳{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="ml-3 text-xl text-gray-500 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
              <div className="text-sm font-medium mt-2">
                {product.inStock ? (
                  <span className="text-green-600">✓ In Stock</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {showFullDescription || product.description.length <= 300
                  ? product.description
                  : product.description.substring(0, 300) + '...'}
              </div>
              {product.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:underline mt-2 text-sm font-medium"
                >
                  {showFullDescription ? 'See Less' : 'See More'}
                </button>
              )}
            </div>

            {product.variations && product.variations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Variation</h3>
                <select
                  value={selectedVariation !== null ? selectedVariation : ''}
                  onChange={(e) => setSelectedVariation(e.target.value === '' ? null : parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a variation</option>
                  {product.variations.map((v, idx) => (
                    <option key={idx} value={idx}>
                      {v.color}
                      {v.ram && ` | ${v.ram}`}
                      {v.rom && ` | ${v.rom}`}
                      {' - ৳'}{v.price.toLocaleString()}
                      {v.stock === 0 ? ' (Out of Stock)' : ` (${v.stock} available)`}
                    </option>
                  ))}
                </select>
                {selectedVariation !== null && product.variations[selectedVariation].stock > 0 && (
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.variations[selectedVariation].stock, quantity + 1))}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={quantity >= product.variations[selectedVariation].stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!product.variations?.length && product.inStock && (
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={quantity >= product.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {product.inStock ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 mb-6"
              >
                Add to Cart
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!user) {
                    alert('Please login to request restock');
                    return;
                  }
                  if (product.variations?.length > 0 && selectedVariation === null) {
                    alert('Please select a variation to request restock notification');
                    return;
                  }
                  try {
                    const requestBody = { productId: id };
                    if (selectedVariation !== null) {
                      requestBody.variation = product.variations[selectedVariation];
                    }
                    await apiCall('/api/restock/requests', {
                      method: 'POST',
                      body: JSON.stringify(requestBody)
                    });
                    alert('Restock request submitted! You will be notified when available.');
                  } catch (error) {
                    console.error('Restock request error:', error);
                    if (error.message.includes('already have a pending restock request')) {
                      alert('You already have a pending restock request for this product. You will be notified when it\'s back in stock.');
                    } else {
                      alert(`Error: ${error.message || 'Failed to submit request'}`);
                    }
                  }
                }}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 mb-6"
              >
                Request Restock Notification
              </button>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.reviews?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
                <div className="space-y-4">
                  {product.reviews.slice(0, 5).map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.userName}</span>
                        <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
