import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiCall } from '../../utils/api';

const ProductCatalog = ({ deals = false }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 50000]);

  useEffect(() => {
    fetchProducts();
  }, [category, deals]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url;
      if (category) {
        const decodedCategory = decodeURIComponent(category).replace(/&amp;/g, '&');
        url = `/api/products?category=${encodeURIComponent(decodedCategory)}&limit=100`;
      } else {
        url = '/api/products?limit=100';
      }
      const res = await apiCall(url);
      let fetchedProducts = res.data.products || [];
      
      // Filter for deals if deals prop is true
      if (deals) {
        fetchedProducts = fetchedProducts.filter(product => product.isDeal);
      }
      
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900">{deals ? 'Hot Deals' : category || 'All Products'}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {deals ? 'Hot Deals' : category ? decodeURIComponent(category).replace(/&amp;/g, '&') : 'All Products'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: BDT {priceRange[0]} - {priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              <button
                onClick={() => setPriceRange([0, 50000])}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-400">⭐ {product.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-lg font-bold text-blue-600">BDT {product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            BDT {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        {product.inStock ? (
                          <span className="text-green-600">In Stock</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
