import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader, { SkeletonCard } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const categories = ['All', 'Electronics', 'Fashion', 'Footwear', 'Accessories', 'Home & Living', 'Beauty', 'Sports'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const inStock = searchParams.get('inStock') || '';
  const page = Number(searchParams.get('page') || 1);

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === '' || val === null || val === undefined || val === 'All') next.delete(key);
    else next.set(key, val);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category && category !== 'All') params.set('category', category);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (rating) params.set('rating', rating);
        if (inStock) params.set('inStock', inStock);
        params.set('page', page);
        params.set('limit', '12');
        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.data || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [keyword, category, sort, minPrice, maxPrice, rating, inStock, page]);

  return (
    <div className="container page">
      <h1 className="section-title">Shop</h1>
      <p className="section-sub">{total} products found</p>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }} className="shop-layout">
        {/* Sidebar filters */}
        <aside className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 84 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Filters</h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Category</div>
            {categories.map((c) => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 6, cursor: 'pointer' }}>
                <input type="radio" name="cat" checked={category === c} onChange={() => setParam('category', c)} />
                {c}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Price Range</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Min" value={localMin} onChange={(e) => setLocalMin(e.target.value)} />
              <input className="input" placeholder="Max" value={localMax} onChange={(e) => setLocalMax(e.target.value)} />
            </div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, width: '100%' }} onClick={() => { setParam('minPrice', localMin); setParam('maxPrice', localMax); }}>Apply</button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Minimum Rating</div>
            {[4, 3, 2].map((r) => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 6, cursor: 'pointer' }}>
                <input type="radio" name="rating" checked={rating === String(r)} onChange={() => setParam('rating', r)} />
                {r}+ stars
              </label>
            ))}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="radio" name="rating" checked={rating === ''} onChange={() => setParam('rating', '')} />
              Any
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={inStock === 'true'} onChange={(e) => setParam('inStock', e.target.checked ? 'true' : '')} />
              In stock only
            </label>
          </div>

          <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => setSearchParams({})}>Clear All</button>
        </aside>

        {/* Main */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <input className="input" placeholder="Search in results..." value={keyword} onChange={(e) => setParam('keyword', e.target.value)} style={{ maxWidth: 320 }} />
            <select className="input" value={sort} onChange={(e) => setParam('sort', e.target.value)} style={{ width: 200 }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          {loading ? (
            <div className="grid-products">{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try adjusting your filters or search term." icon="🔍" />
          ) : (
            <>
              <div className="grid-products">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                  {Array.from({ length: pages }).map((_, i) => (
                    <button key={i} onClick={() => setParam('page', i + 1)} className={page === i + 1 ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`@media(max-width:768px){.shop-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default Shop;
