/* eslint-disable react/prop-types */
import { MdArrowForwardIos } from 'react-icons/md'
import { FaSearch } from 'react-icons/fa'
import { useGetBrandsQuery } from '../../redux/slices/brandsApiSlice'
import { useGetCategoriesQuery } from '../../redux/slices/categoriesApiSlice'
import Loader from '../Loader'
import { Link, useSearchParams } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const FilterSidebar = ({ filters }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery({})
    const { data: categories, isLoading: isCategoriesLoading } =
        useGetCategoriesQuery({})

    const [searchItem, setSearchItem] = useState('')
    const [filterBrands, setFilterBrands] = useState([])

    // State for min and max price
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(null)

    useEffect(() => {
        if (brands) {
            setFilterBrands(brands?.doc)
        }
    }, [brands])

    const priceRangeHandler = () => {
        searchParams.set('price[gte]', minPrice)
        searchParams.set('price[lte]', maxPrice)

        if (minPrice > maxPrice) {
            return toast.error('The min price is greater then max price.')
        }

        filters = {
            'price[gte]': minPrice,
            'price[lte]': maxPrice,
        }
        setSearchParams(searchParams)
    }

    const handleBrandsSerach = (e) => {
        const searchTerm = e.target.value
        setSearchItem(searchTerm)

        const filteredItems = brands?.doc?.filter((brand) =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilterBrands(filteredItems)
    }

    return (
        <div className="mb-2 mt-2 bg-white p-6 rounded-lg shadow-lg w-full max-w-xs hidden lg:block">
            <h2 className="text-xl font-semibold mb-4">Filter</h2>

            <div className="mb-4">
                <label htmlFor="filterSelect" className="block text-gray-700">
                    Choose
                </label>
                <select
                    id="filterSelect"
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                >
                    <option>Choose</option>
                    {/* Add more options as needed */}
                </select>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-medium">Price</h3>
                <div className="flex items-center justify-between gap-2 mt-2">
                    <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-1/2 input px-3 py-2"
                    />
                    <span className="mx-2">To</span>
                    <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="100"
                        className="w-1/2 input px-3 py-2"
                    />
                    <button
                        onClick={priceRangeHandler}
                        className="bg-primary-500 text-white rounded-lg px-3 py-3"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>

            <div className="mb-4 overflow-hidden">
                <h3 className="text-lg font-medium">Brands</h3>
                <div className="relative mt-2">
                    <input
                        type="text"
                        value={searchItem}
                        onChange={handleBrandsSerach}
                        placeholder="Search by brands"
                        className="w-full input"
                    />
                    <button className="absolute right-2 top-2 text-gray-400 flex items-center justify-center ">
                        <FaSearch className="h-4 w-4" />
                    </button>
                </div>
                <ul className="mt-4 space-y-2">
                    {isBrandsLoading ? (
                        <Loader />
                    ) : filterBrands ? (
                        filterBrands.map((brand) => {
                            if (brand.productCount > 0)
                                return (
                                    <li key={brand._id}>
                                        <Link
                                            to={`/products?brand=${brand._id}`}
                                            className="flex justify-between items-center hover:text-primary-700"
                                        >
                                            <span>
                                                {capitalizeFirstLetter(
                                                    brand.name
                                                )}
                                            </span>
                                            <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1">
                                                {brand.productCount}
                                            </span>
                                        </Link>
                                    </li>
                                )
                        })
                    ) : (
                        <li>No Brands found!</li>
                    )}
                </ul>
            </div>

            <div className="text-center">
                <h3 className="text-lg font-medium">Categories</h3>
            </div>
            <ul className="mt-4 space-y-2">
                {isCategoriesLoading ? (
                    <Loader />
                ) : categories ? (
                    categories?.doc?.map((category) => {
                        if (category?.productCount > 0)
                            return (
                                <li key={category._id}>
                                    <Link
                                        to={`/products?category=${category._id}`}
                                        className="flex justify-between items-center hover:text-primary-700"
                                    >
                                        <span>
                                            {capitalizeFirstLetter(
                                                category.name
                                            )}
                                        </span>
                                        <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1">
                                            {category.productCount}
                                        </span>
                                    </Link>
                                </li>
                            )
                    })
                ) : (
                    <li>No Categories found!</li>
                )}
            </ul>
        </div>
    )
}

export default FilterSidebar
